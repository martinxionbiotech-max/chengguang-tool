---
title: "Reserve Capacity (RC) Calculator"
description: "Estimate battery reserve-capacity minutes from Ah and typical load, plus an SAE-style 25A reference estimate. Built by Chengguang Power Tech."
hide:
  - toc
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Reserve Capacity (RC) Calculator",
  "url": "https://tool.chengguangenergy.com/reserve-capacity-calculator/",
  "description": "Estimate automotive battery reserve-capacity minutes from Ah capacity and typical accessory load, with a 25A SAE-style reference estimate.",
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

# ⏱️ Reserve Capacity (RC) Calculator

Estimate how many minutes a battery can support a load, and get an SAE-style reference reserve capacity at a 25A load.

**Conservative estimate:** `Minutes = (Ah × usable depth) ÷ load (A) × 60`

---

<div x-data="rcCalculator()" class="tool-card" markdown="1">

### Battery & Load Parameters

<div class="cg-form-group">
  <label class="cg-label">Battery Capacity (Ah, C20)</label>
  <input type="number" class="cg-input" x-model.number="capacityAh" min="10" max="300" step="1" placeholder="e.g. 65">
</div>

<div class="cg-form-group">
  <label class="cg-label">Battery Type</label>
  <select class="cg-select" x-model="batteryType">
    <option value="sli">SLI (flooded) — 50% usable depth</option>
    <option value="efb">EFB (enhanced flooded) — 60% usable depth</option>
    <option value="agm">AGM (absorbent glass mat) — 80% usable depth</option>
    <option value="deepcycle">Deep Cycle — 70% usable depth</option>
  </select>
</div>

<div class="cg-form-group">
  <label class="cg-label">Typical Load (Amps)</label>
  <input type="number" class="cg-input" x-model.number="loadAmps" min="0.5" max="100" step="0.5" placeholder="e.g. 10">
  <small style="color:#6b7280;">Continuous accessory load, e.g. fridge, lights, fan, electronics.</small>
</div>

<button class="cg-btn" @click="calculate()" :disabled="!canCalculate">⏱️ Calculate Reserve Capacity</button>

<div x-show="result" x-transition class="cg-result" style="display:none;">
  <h4>⏱️ Reserve Capacity Estimate</h4>
  <div class="spec-row"><span class="spec-label">Battery Capacity</span><span class="spec-value" x-text="capacityAh + ' Ah (C20)'"></span></div>
  <div class="spec-row"><span class="spec-label">Usable Depth</span><span class="spec-value" x-text="(dodPercent * 100) + '%'"></span></div>
  <div class="spec-row"><span class="spec-label">Usable Capacity</span><span class="spec-value" x-text="usableAh + ' Ah'"></span></div>
  <div class="spec-row"><span class="spec-label">Load</span><span class="spec-value" x-text="loadAmps + ' A'"></span></div>
  <div class="spec-row" style="font-size:1.1rem;border-bottom:2px solid var(--cg-purple);">
    <span class="spec-label">Estimated Runtime at Load</span>
    <span class="spec-value" x-text="runtimeText"></span>
  </div>
  <div class="spec-row"><span class="spec-label">Reference RC at 25A (rule of thumb)</span><span class="spec-value" x-text="rc25 + ' minutes'"></span></div>

  <div x-show="warnings" class="cg-warning" x-html="warnings"></div>

  <div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
    <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Battery Datasheets</a>
  </div>
</div>

</div>

<script>
function rcCalculator() {
  return {
    capacityAh: '',
    batteryType: 'sli',
    loadAmps: '',
    result: false,
    usableAh: 0,
    dodPercent: 0,
    rc25: 0,
    runtimeText: '',
    warnings: '',

    get canCalculate() {
      return this.capacityAh > 0 && this.loadAmps > 0;
    },

    calculate() {
      if (!this.canCalculate) return;
      this.warnings = '';

      const types = {
        sli: { dod: 0.50, rcFactor: 1.5, label: 'SLI (flooded)' },
        efb: { dod: 0.60, rcFactor: 1.5, label: 'EFB (enhanced flooded)' },
        agm: { dod: 0.80, rcFactor: 1.6, label: 'AGM' },
        deepcycle: { dod: 0.70, rcFactor: 1.4, label: 'Deep Cycle' }
      };
      const t = types[this.batteryType] || types.sli;
      this.dodPercent = t.dod;
      this.usableAh = Math.round(this.capacityAh * t.dod * 10) / 10;

      // Rule-of-thumb standard RC reference at 25A
      this.rc25 = Math.round(this.capacityAh * t.rcFactor);

      // Conservative runtime at the chosen load
      const minutes = (this.usableAh / this.loadAmps) * 60;
      this.runtimeText = this.formatMinutes(minutes);

      if (this.loadAmps > 25) {
        this.warnings = '⚠️ At loads above the 25A RC reference, the Peukert effect reduces available capacity non-linearly. Treat this as a rough, conservative planning estimate and verify with the battery datasheet.';
      }
      if (this.batteryType === 'sli') {
        this.warnings = (this.warnings ? this.warnings + ' ' : '') + '⚠️ SLI batteries are designed for starting, not sustained deep discharge. Repeated deep cycling will shorten their life.';
      }
      if (this.batteryType === 'agm' && this.loadAmps > 50) {
        this.warnings = (this.warnings ? this.warnings + ' ' : '') + '⚠️ Even AGM batteries should be sized conservatively for heavy sustained loads.';
      }

      this.result = true;
    },

    formatMinutes(minutes) {
      if (minutes >= 1440) {
        const days = Math.floor(minutes / 1440);
        const h = Math.floor((minutes % 1440) / 60);
        return `${days} day${days > 1 ? 's' : ''} ${h} h`;
      }
      if (minutes >= 60) {
        const h = Math.floor(minutes / 60);
        const m = Math.round(minutes % 60);
        return `${h} h ${m} min`;
      }
      return `${Math.round(minutes)} minutes`;
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
      "name": "What is battery Reserve Capacity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Reserve Capacity is the number of minutes a fully charged 12V battery can deliver 25 amps at about 27°C before terminal voltage drops below 10.5V. It is commonly measured to SAE J537."
      }
    },
    {
      "@type": "Question",
      "name": "How do I estimate RC minutes from Ah?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A common rule of thumb for flooded SLI batteries is RC minutes ≈ Ah × 1.5. Actual reserve capacity varies with plate design, temperature, and discharge rate, so this calculator gives a planning estimate rather than a guaranteed test result."
      }
    },
    {
      "@type": "Question",
      "name": "Does battery type affect usable runtime?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. AGM tolerates deeper discharge (about 80% usable depth in repeated cycling), while a standard SLI battery should be kept near 50% to protect its service life. Deep-cycle batteries are built for deeper cycling."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if my load is higher than 25A?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Runtime falls faster than a simple linear estimate because high discharge rates reduce effective capacity (the Peukert effect). The calculator still returns a conservative planning estimate, but the datasheet should be checked for heavy loads."
      }
    },
    {
      "@type": "Question",
      "name": "Are these results exact?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Results are honest planning estimates based on rated capacity and typical usable depth. Actual runtime depends on temperature, battery age, state of health, and load profile."
      }
    }
  ]
}
</script>

### What is battery Reserve Capacity?
Reserve Capacity is the number of minutes a fully charged 12V battery can deliver 25 amps at about 27°C before terminal voltage drops below 10.5V. It is commonly measured to SAE J537.

### How do I estimate RC minutes from Ah?
A common rule of thumb for flooded SLI batteries is RC minutes ≈ Ah × 1.5. Actual reserve capacity varies with plate design, temperature, and discharge rate, so this calculator gives a planning estimate rather than a guaranteed test result.

### Does battery type affect usable runtime?
Yes. AGM tolerates deeper discharge (about 80% usable depth in repeated cycling), while a standard SLI battery should be kept near 50% to protect its service life. Deep-cycle batteries are built for deeper cycling.

### What happens if my load is higher than 25A?
Runtime falls faster than a simple linear estimate because high discharge rates reduce effective capacity (the Peukert effect). The calculator still returns a conservative planning estimate, but the datasheet should be checked for heavy loads.

### Are these results exact?
No. Results are honest planning estimates based on rated capacity and typical usable depth. Actual runtime depends on temperature, battery age, state of health, and load profile.
