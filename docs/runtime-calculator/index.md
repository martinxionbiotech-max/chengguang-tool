# ⏱️ Battery Runtime Calculator

Estimate how long a battery will power a given load. Based on Amp-hour capacity, battery type, and load wattage.

**Formula:** `Runtime (hours) = (Ah × DoD) ÷ (Watts ÷ 12V)`

---

<div x-data="runtimeCalculator()" class="tool-card" markdown="1">

### Battery & Load Parameters

<div class="cg-form-group">
  <label class="cg-label">Battery Capacity (Ah)</label>
  <input type="number" class="cg-input" x-model.number="capacityAh" min="10" max="300" step="1" placeholder="e.g. 60">
</div>

<div class="cg-form-group">
  <label class="cg-label">Battery Type</label>
  <select class="cg-select" x-model="batteryType">
    <option value="sli">SLI (Starting/Lighting/Ignition) — 50% DoD safe</option>
    <option value="agm">AGM (Absorbent Glass Mat) — 80% DoD safe</option>
    <option value="deepcycle">Deep Cycle — 50% DoD safe (designed for deep discharge)</option>
  </select>
  <small style="color:#6b7280;">DoD = Depth of Discharge safe limit</small>
</div>

<div class="cg-form-group">
  <label class="cg-label">Continuous Load (Watts)</label>
  <input type="number" class="cg-input" x-model.number="loadWatts" min="1" max="5000" step="1" placeholder="e.g. 120">
  <small style="color:#6b7280;">Total wattage of connected devices</small>
</div>

<button class="cg-btn" @click="calculate()" :disabled="!canCalculate">⏱️ Calculate Runtime</button>

<!-- Result -->
<div x-show="result" x-transition class="cg-result" style="display:none;">
  <h4>⏱️ Runtime Estimate</h4>
  <div class="spec-row"><span class="spec-label">Battery Capacity</span><span class="spec-value" x-text="capacityAh + ' Ah'"></span></div>
  <div class="spec-row"><span class="spec-label">Usable Capacity (DoD)</span><span class="spec-value" x-text="usableAh + ' Ah (' + (dodPercent * 100) + '%)'"></span></div>
  <div class="spec-row"><span class="spec-label">Load Current</span><span class="spec-value" x-text="loadAmps + ' A'"></span></div>
  <div class="spec-row"><span class="spec-label">Load Power</span><span class="spec-value" x-text="loadWatts + ' W @ 12V'"></span></div>
  <div class="spec-row" style="font-size:1.2rem;border-bottom:2px solid var(--cg-purple);">
    <span class="spec-label">Estimated Runtime</span>
    <span class="spec-value" x-text="resultHours"></span>
  </div>

  <div x-show="wattWarning" class="cg-warning" x-text="wattWarning"></div>

  <div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
    <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Battery Datasheets</a>
  </div>
</div>

</div>

<script>
function runtimeCalculator() {
  return {
    capacityAh: '',
    batteryType: 'sli',
    loadWatts: '',
    result: false,
    usableAh: 0,
    dodPercent: 0,
    loadAmps: 0,
    resultHours: '',
    wattWarning: '',

    get canCalculate() {
      return this.capacityAh > 0 && this.loadWatts > 0;
    },

    calculate() {
      if (!this.canCalculate) return;
      this.wattWarning = '';

      // Determine DoD by battery type
      let dod;
      switch (this.batteryType) {
        case 'agm': dod = 0.80; break;
        case 'deepcycle': dod = 0.50; break;
        case 'sli':
        default: dod = 0.50; break;
      }
      this.dodPercent = dod;
      this.usableAh = Math.round(this.capacityAh * dod * 10) / 10;

      // Load current at 12V
      this.loadAmps = Math.round((this.loadWatts / 12) * 100) / 100;

      // Runtime
      const hours = this.usableAh / this.loadAmps;
      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = Math.round(hours % 24);
        this.resultHours = `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} (${Math.round(hours)} h total)`;
      } else if (hours >= 1) {
        const wholeHours = Math.floor(hours);
        const mins = Math.round((hours - wholeHours) * 60);
        this.resultHours = `${wholeHours} hour${wholeHours > 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''} (${Math.round(hours * 100) / 100} h)`;
      } else {
        const mins = Math.round(hours * 60);
        this.resultHours = `${mins} minute${mins !== 1 ? 's' : ''} (${Math.round(hours * 100) / 100} h)`;
      }

      // Warnings
      if (this.loadWatts > 1000) {
        this.wattWarning = '⚠️ High load detected. For loads above 1000W, consider using a deep-cycle or AGM battery and verify wiring gauge is adequate.';
      }
      if (this.batteryType === 'sli' && hours < 2) {
        this.wattWarning = (this.wattWarning ? this.wattWarning + ' ' : '') + '⚠️ SLI batteries are not designed for sustained deep discharge. Repeated deep cycling will reduce lifespan significantly.';
      }

      this.result = true;
    }
  };
}
</script>

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Battery Runtime Calculator",
  "url": "https://tool.chengguangenergy.com/runtime-calculator/",
  "description": "Estimate how long a battery can run your devices — calculate runtime for camping, tailgating, or emergency power based on battery capacity and load.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web",
  "author": {
    "@type": "Organization",
    "name": "Chengguang Power Tech Co., Ltd.",
    "url": "https://chengguangenergy.com/"
  }
}
</script>



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
      "name": "How long can a car battery run accessories?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A typical 65Ah SLI battery running a 100W device (~8.3A) will last approximately 2.5 hours before reaching the safe discharge limit. AGM batteries can run longer (deeper discharge tolerance). Never discharge a car battery below 50% (SLI) or it may sustain permanent damage."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use my car battery for camping power?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, but with limitations. SLI batteries are designed for short, high-current bursts (starting), not deep discharge. For camping, consider a deep-cycle or AGM battery. Always carry a jump starter as backup."
      }
    },
    {
      "@type": "Question",
      "name": "What's the difference between SLI and deep cycle for running accessories?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SLI batteries should not be discharged below 70% (only 30% usable capacity). Deep cycle batteries can be discharged to 20% (80% usable). AGM is in between at ~50% usable. The calculator adjusts for battery type."
      }
    },
    {
      "@type": "Question",
      "name": "How do I convert watts to amps for 12V?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Amps = Watts ÷ Volts. For a 12V system: a 120W device draws 10A, a 60W device draws 5A, a 12W device draws 1A. The calculator does this automatically."
      }
    },
    {
      "@type": "Question",
      "name": "Will running accessories drain my starting ability?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. If you run the battery below 12.0V (approximately 50% discharge), the vehicle may not start. Plan to stop using accessories when voltage drops below 12.2V, or run the engine periodically to recharge."
      }
    },
    {
      "@type": "Question",
      "name": "How do I recharge after running accessories?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Drive for at least 30 minutes at highway speeds, or use a smart battery charger. A deeply discharged battery may need 4-8 hours on a charger."
      }
    }
  ]
}

</script>

### How long can a car battery run accessories?
A typical 65Ah SLI battery running a 100W device (~8.3A) will last approximately 2.5 hours before reaching the safe discharge limit. AGM batteries can run longer (deeper discharge tolerance). Never discharge a car battery below 50% (SLI) or it may sustain permanent damage.

### Can I use my car battery for camping power?
Yes, but with limitations. SLI batteries are designed for short, high-current bursts (starting), not deep discharge. For camping, consider a deep-cycle or AGM battery. Always carry a jump starter as backup.

### What's the difference between SLI and deep cycle for running accessories?
SLI batteries should not be discharged below 70% (only 30% usable capacity). Deep cycle batteries can be discharged to 20% (80% usable). AGM is in between at ~50% usable. The calculator adjusts for battery type.

### How do I convert watts to amps for 12V?
Amps = Watts ÷ Volts. For a 12V system: a 120W device draws 10A, a 60W device draws 5A, a 12W device draws 1A. The calculator does this automatically.

### Will running accessories drain my starting ability?
Yes. If you run the battery below 12.0V (approximately 50% discharge), the vehicle may not start. Plan to stop using accessories when voltage drops below 12.2V, or run the engine periodically to recharge.

### How do I recharge after running accessories?
Drive for at least 30 minutes at highway speeds, or use a smart battery charger. A deeply discharged battery may need 4-8 hours on a charger.



---

## :material-family-tree: Chengguang Battery Knowledge Ecosystem

| Site | Purpose |
|------|---------|
| :material-domain: **[Main Site](https://chengguangenergy.com/)** | Factory, certifications, contact |
| :material-car-battery: **[Battery Database](https://data.chengguangenergy.com/)** | Models, specs, cross-reference |
| :material-bookshelf: **[Technical Center](https://technical.chengguangenergy.com/)** | Technology, engineering, testing |
| :material-package-variant-closed: **[OEM Manufacturing](https://oem.chengguangenergy.com/)** | Private label, custom, process |
| :material-earth: **[Market Intelligence](https://market.chengguangenergy.com/)** | Regional demand, trends |
| :material-tools: **Battery Tools** ← You are here | Finders, calculators, guides |

**Chengguang Power Tech Co., Ltd.** — IATF 16949 certified since 2002. [Visit main site](https://chengguangenergy.com/).
