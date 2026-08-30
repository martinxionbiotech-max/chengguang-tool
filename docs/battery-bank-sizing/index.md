---
title: "Battery Bank Sizing Calculator"
description: "Size an RV, marine, or solar battery bank from total daily Ah load. Get recommended bank Ah plus 12V/24V series-parallel configuration using Chengguang models."
hide:
  - toc
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Battery Bank Sizing Calculator",
  "url": "https://tool.chengguangenergy.com/battery-bank-sizing/",
  "description": "Calculate recommended battery bank Ah for RV, marine, and solar systems from total daily Ah load, with 12V or 24V series-parallel configuration.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web",
  "author": {
    "@id": "https://chengguangenergy.com/#organization",
    "@type": "Organization",
    "name": "Chengguang Power Tech Co., Ltd.",
    "url": "https://chengguangenergy.com/"
  }
}
</script>

# 🔋 Battery Bank Sizing Calculator

Size an RV, marine, or solar battery bank from your total daily amp-hour load. The result shows the recommended bank Ah and a 12V or 24V series-parallel configuration using Chengguang batteries.

**Formula:** `Bank Ah = (Daily Ah × Autonomy Days) ÷ Max Depth of Discharge`

---

<div x-data="bankSizing()" class="tool-card" markdown="1">

### Load & System Parameters

<div class="cg-form-group">
  <label class="cg-label">System Voltage</label>
  <select class="cg-select" x-model="systemVoltage">
    <option value="12">12V system</option>
    <option value="24">24V system</option>
  </select>
</div>

<div class="cg-form-group">
  <label class="cg-label">Total Daily Load (Ah/day)</label>
  <input type="number" class="cg-input" x-model.number="dailyAh" min="10" max="2000" step="5" placeholder="e.g. 120">
  <small style="color:#6b7280;">If you know watts, divide total watt-hours by system voltage.</small>
</div>

<div class="cg-form-group">
  <label class="cg-label">Days of Autonomy</label>
  <select class="cg-select" x-model="autonomyDays">
    <option value="1">1 day (grid/solar available daily)</option>
    <option value="2" selected>2 days (cloud cover / off-grid buffer)</option>
    <option value="3">3 days (extended off-grid)</option>
    <option value="4">4 days (remote / critical loads)</option>
  </select>
</div>

<div class="cg-form-group">
  <label class="cg-label">Maximum Depth of Discharge (DoD)</label>
  <select class="cg-select" x-model="dod">
    <option value="0.3">30% — longest life (conservative)</option>
    <option value="0.5" selected>50% — standard flooded / deep cycle</option>
    <option value="0.8">80% — AGM / lithium-style cycling</option>
  </select>
</div>

<div class="cg-form-group">
  <label class="cg-label">Preferred Chengguang Battery Model</label>
  <select class="cg-select" x-model="batteryId">
    <option value="55d23">CG-55D23 — 60Ah, 500 CCA (JIS)</option>
    <option value="65d26" selected>CG-65D26 — 65Ah, 500 CCA (JIS)</option>
    <option value="105d31">CG-105D31 — 90Ah, 650 CCA (JIS)</option>
    <option value="95e41">CG-95E41 — 100Ah, 750 CCA (JIS)</option>
    <option value="145g51">CG-145G51 — 130Ah, 850 CCA (JIS)</option>
    <option value="190h52">CG-190H52 — 200Ah, 1100 CCA (JIS)</option>
    <option value="60038">CG-DIN60038 — 100Ah, 870 CCA (DIN)</option>
  </select>
</div>

<button class="cg-btn" @click="calculate()" :disabled="!canCalculate">🔋 Size Battery Bank</button>

<div x-show="result" x-transition class="cg-result" style="display:none;">
  <h4>🔋 Battery Bank Recommendation</h4>
  <div class="spec-row"><span class="spec-label">Daily Load</span><span class="spec-value" x-text="dailyAh + ' Ah @ ' + systemVoltage + 'V'"></span></div>
  <div class="spec-row"><span class="spec-label">Autonomy</span><span class="spec-value" x-text="autonomyDays + ' day(s)'"></span></div>
  <div class="spec-row"><span class="spec-label">Usable Bank Needed</span><span class="spec-value" x-text="usableNeeded + ' Ah'"></span></div>
  <div class="spec-row" style="font-size:1.1rem;border-bottom:2px solid var(--cg-purple);">
    <span class="spec-label">Recommended Bank Size</span>
    <span class="spec-value" x-text="bankAh + ' Ah @ ' + systemVoltage + 'V'"></span>
  </div>
  <div class="spec-row"><span class="spec-label">Chosen Battery</span><span class="spec-value" x-text="batteryName"></span></div>
  <div class="spec-row"><span class="spec-label">Battery Capacity</span><span class="spec-value" x-text="batteryAh + ' Ah'"></span></div>
  <div class="spec-row"><span class="spec-label">Series-Parallel Configuration</span><span class="spec-value" x-text="configText"></span></div>
  <div class="spec-row"><span class="spec-label">Batteries Required</span><span class="spec-value" x-text="totalBatteries + ' pcs'"></span></div>
  <div class="spec-row"><span class="spec-label">Actual Installed Bank</span><span class="spec-value" x-text="actualBankAh + ' Ah @ ' + systemVoltage + 'V'"></span></div>

  <div x-show="warnings" class="cg-warning" x-html="warnings"></div>

  <div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
    <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Battery Datasheets</a>
  </div>
</div>

</div>

<script>
function bankSizing() {
  return {
    systemVoltage: '12',
    dailyAh: '',
    autonomyDays: '2',
    dod: '0.5',
    batteryId: '65d26',
    result: false,
    usableNeeded: 0,
    bankAh: 0,
    batteryName: '',
    batteryAh: 0,
    configText: '',
    totalBatteries: 0,
    actualBankAh: 0,
    warnings: '',

    batteries: [
      { id: '55d23', name: 'CG-55D23', ah: 60 },
      { id: '65d26', name: 'CG-65D26', ah: 65 },
      { id: '105d31', name: 'CG-105D31', ah: 90 },
      { id: '95e41', name: 'CG-95E41', ah: 100 },
      { id: '145g51', name: 'CG-145G51', ah: 130 },
      { id: '190h52', name: 'CG-190H52', ah: 200 },
      { id: '60038', name: 'CG-DIN60038', ah: 100 }
    ],

    get canCalculate() {
      return this.dailyAh > 0;
    },

    calculate() {
      if (!this.canCalculate) return;
      this.warnings = '';

      const days = parseInt(this.autonomyDays, 10);
      const dod = parseFloat(this.dod);
      const volts = parseInt(this.systemVoltage, 10);
      const battery = this.batteries.find(b => b.id === this.batteryId) || this.batteries[1];
      this.batteryName = battery.name;
      this.batteryAh = battery.ah;

      this.usableNeeded = Math.round(this.dailyAh * days);
      this.bankAh = Math.round(this.usableNeeded / dod);

      // Series-parallel config. Every 12V battery needs 2 in series for a 24V bank.
      const strings = Math.max(1, Math.ceil(this.bankAh / battery.ah));
      if (volts === 24) {
        this.totalBatteries = strings * 2;
        this.configText = `${strings} string(s) × (2 × 12V ${battery.name} in series) in parallel`;
      } else {
        this.totalBatteries = strings;
        this.configText = `${strings} × 12V ${battery.name} in parallel`;
      }

      this.actualBankAh = strings * battery.ah;
      const actualUsable = Math.round(this.actualBankAh * dod);

      if (this.dailyAh > 500) {
        this.warnings = '⚠️ Large daily loads: verify cable gauge, fusing, and charging current with a qualified marine/solar electrician.';
      }
      this.warnings = (this.warnings ? this.warnings + ' ' : '') + `ℹ️ Add ~20% margin for inverter losses and aging. Installed bank delivers about ${actualUsable} Ah usable at ${dod * 100}% DoD.`;

      this.result = true;
    }
  };
}
</script>

---

<div class="ecosystem-footer" x-data="ecosystem">
<h4>🌐 Explore the Chengguang Ecosystem</h4>
<div class="ecosystem-links">
  <template x-for="site in sites" :key="site.url">
    <a :href="site.url" class="eco-link" :class="{ active: site.active }" x-text="site.name" target="_blank"></a>
  </template>
</div>
</div>

---

## :material-help-circle: Frequently Asked Questions

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a battery bank?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A battery bank is a group of batteries wired in series and/or parallel to provide the required system voltage and amp-hour capacity. Series raises voltage, while parallel raises capacity."
      }
    },
    {
      "@type": "Question",
      "name": "How do I convert daily watt-hours to amp-hours?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Divide total daily watt-hours by the system voltage. For example, 1,200Wh per day on a 12V system is about 100Ah per day."
      }
    },
    {
      "@type": "Question",
      "name": "Why add days of autonomy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Autonomy covers periods without sufficient charging, such as cloudy days for solar systems or days without shore power. Two days is a common buffer for off-grid use."
      }
    },
    {
      "@type": "Question",
      "name": "What depth of discharge should I use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use 30-50% for flooded and deep-cycle batteries to maximize service life, or up to 80% for AGM batteries. Shallower cycling generally extends battery life."
      }
    },
    {
      "@type": "Question",
      "name": "Does this replace a professional design review?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. This is a sizing estimate, not a substitute for professional review of cable sizing, fusing, ventilation, charging, and local electrical codes."
      }
    }
  ]
}
</script>

### What is a battery bank?
A battery bank is a group of batteries wired in series and/or parallel to provide the required system voltage and amp-hour capacity. Series raises voltage, while parallel raises capacity.

### How do I convert daily watt-hours to amp-hours?
Divide total daily watt-hours by the system voltage. For example, 1,200Wh per day on a 12V system is about 100Ah per day.

### Why add days of autonomy?
Autonomy covers periods without sufficient charging, such as cloudy days for solar systems or days without shore power. Two days is a common buffer for off-grid use.

### What depth of discharge should I use?
Use 30-50% for flooded and deep-cycle batteries to maximize service life, or up to 80% for AGM batteries. Shallower cycling generally extends battery life.

### Does this replace a professional design review?
No. This is a sizing estimate, not a substitute for professional review of cable sizing, fusing, ventilation, charging, and local electrical codes.
