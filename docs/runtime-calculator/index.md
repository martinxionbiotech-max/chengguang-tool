     1|# ⏱️ Battery Runtime Calculator
     2|
     3|Estimate how long a battery will power a given load. Based on Amp-hour capacity, battery type, and load wattage.
     4|
     5|**Formula:** `Runtime (hours) = (Ah × DoD) ÷ (Watts ÷ 12V)`
     6|
     7|---
     8|
     9|<div x-data="runtimeCalculator()" class="tool-card">
    10|
    11|### Battery & Load Parameters
    12|
    13|<div class="cg-form-group">
    14|  <label class="cg-label">Battery Capacity (Ah)</label>
    15|  <input type="number" class="cg-input" x-model.number="capacityAh" min="10" max="300" step="1" placeholder="e.g. 60">
    16|</div>
    17|
    18|<div class="cg-form-group">
    19|  <label class="cg-label">Battery Type</label>
    20|  <select class="cg-select" x-model="batteryType">
    21|    <option value="sli">SLI (Starting/Lighting/Ignition) — 50% DoD safe</option>
    22|    <option value="agm">AGM (Absorbent Glass Mat) — 80% DoD safe</option>
    23|    <option value="deepcycle">Deep Cycle — 50% DoD safe (designed for deep discharge)</option>
    24|  </select>
    25|  <small style="color:#6b7280;">DoD = Depth of Discharge safe limit</small>
    26|</div>
    27|
    28|<div class="cg-form-group">
    29|  <label class="cg-label">Continuous Load (Watts)</label>
    30|  <input type="number" class="cg-input" x-model.number="loadWatts" min="1" max="5000" step="1" placeholder="e.g. 120">
    31|  <small style="color:#6b7280;">Total wattage of connected devices</small>
    32|</div>
    33|
    34|<button class="cg-btn" @click="calculate()" :disabled="!canCalculate">⏱️ Calculate Runtime</button>
    35|
    36|<!-- Result -->
    37|<div x-show="result" x-transition class="cg-result" style="display:none;">
    38|  <h4>⏱️ Runtime Estimate</h4>
    39|  <div class="spec-row"><span class="spec-label">Battery Capacity</span><span class="spec-value" x-text="capacityAh + ' Ah'"></span></div>
    40|  <div class="spec-row"><span class="spec-label">Usable Capacity (DoD)</span><span class="spec-value" x-text="usableAh + ' Ah (' + (dodPercent * 100) + '%)'"></span></div>
    41|  <div class="spec-row"><span class="spec-label">Load Current</span><span class="spec-value" x-text="loadAmps + ' A'"></span></div>
    42|  <div class="spec-row"><span class="spec-label">Load Power</span><span class="spec-value" x-text="loadWatts + ' W @ 12V'"></span></div>
    43|  <div class="spec-row" style="font-size:1.2rem;border-bottom:2px solid var(--cg-purple);">
    44|    <span class="spec-label">Estimated Runtime</span>
    45|    <span class="spec-value" x-text="resultHours"></span>
    46|  </div>
    47|
    48|  <div x-show="wattWarning" class="cg-warning" x-text="wattWarning"></div>
    49|
    50|  <div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    51|    <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
    52|    <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Battery Datasheets</a>
    53|  </div>
    54|</div>
    55|
    56|</div>
    57|
    58|<script>
    59|function runtimeCalculator() {
    60|  return {
    61|    capacityAh: '',
    62|    batteryType: 'sli',
    63|    loadWatts: '',
    64|    result: false,
    65|    usableAh: 0,
    66|    dodPercent: 0,
    67|    loadAmps: 0,
    68|    resultHours: '',
    69|    wattWarning: '',
    70|
    71|    get canCalculate() {
    72|      return this.capacityAh > 0 && this.loadWatts > 0;
    73|    },
    74|
    75|    calculate() {
    76|      if (!this.canCalculate) return;
    77|      this.wattWarning = '';
    78|
    79|      // Determine DoD by battery type
    80|      let dod;
    81|      switch (this.batteryType) {
    82|        case 'agm': dod = 0.80; break;
    83|        case 'deepcycle': dod = 0.50; break;
    84|        case 'sli':
    85|        default: dod = 0.50; break;
    86|      }
    87|      this.dodPercent = dod;
    88|      this.usableAh = Math.round(this.capacityAh * dod * 10) / 10;
    89|
    90|      // Load current at 12V
    91|      this.loadAmps = Math.round((this.loadWatts / 12) * 100) / 100;
    92|
    93|      // Runtime
    94|      const hours = this.usableAh / this.loadAmps;
    95|      if (hours >= 24) {
    96|        const days = Math.floor(hours / 24);
    97|        const remainingHours = Math.round(hours % 24);
    98|        this.resultHours = `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} (${Math.round(hours)} h total)`;
    99|      } else if (hours >= 1) {
   100|        const wholeHours = Math.floor(hours);
   101|        const mins = Math.round((hours - wholeHours) * 60);
   102|        this.resultHours = `${wholeHours} hour${wholeHours > 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''} (${Math.round(hours * 100) / 100} h)`;
   103|      } else {
   104|        const mins = Math.round(hours * 60);
   105|        this.resultHours = `${mins} minute${mins !== 1 ? 's' : ''} (${Math.round(hours * 100) / 100} h)`;
   106|      }
   107|
   108|      // Warnings
   109|      if (this.loadWatts > 1000) {
   110|        this.wattWarning = '⚠️ High load detected. For loads above 1000W, consider using a deep-cycle or AGM battery and verify wiring gauge is adequate.';
   111|      }
   112|      if (this.batteryType === 'sli' && hours < 2) {
   113|        this.wattWarning = (this.wattWarning ? this.wattWarning + ' ' : '') + '⚠️ SLI batteries are not designed for sustained deep discharge. Repeated deep cycling will reduce lifespan significantly.';
   114|      }
   115|
   116|      this.result = true;
   117|    }
   118|  };
   119|}
   120|</script>
   121|
   122|---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Battery Runtime Calculator",
  "url": "https://tool.chengguangenergy.com/runtime-calculator/",
  "description": "Estimate how long a battery can run your devices — calculate runtime for camping, tailgating, or emergency power based on battery capacity and load.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": {
    "@type": "Organization",
    "name": "Chengguang Power Tech Co., Ltd.",
    "url": "https://chengguangenergy.com/"
  }
}
</script>


   123|
   124|<div class="ecosystem-footer" x-data="ecosystem">
   125|<h4>🌐 Explore the Chengguang Ecosystem</h4>
   126|<div class="ecosystem-links">
   127|  <template x-for="site in sites" :key="site.url">
   128|    <a :href="site.url" class="eco-link" :class="{ active: site.active }" x-text="site.name" target="_blank"></a>
   129|  </template>
   130|</div>
   131|</div>
   132|

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
