     1|# 🔁 Ah ↔ CCA Converter
     2|
     3|Bidirectional converter between Amp-hours (Ah) and Cold Cranking Amps (CCA).  
     4|The relationship is approximate: **CCA ≈ Ah × 7 to 10** (varies by battery design).
     5|
     6|---
     7|
     8|<div x-data="ahCcaConverter()" class="tool-card">
     9|
    10|### Converter
    11|
    12|<div class="cg-form-group">
    13|  <label class="cg-label">Conversion Direction</label>
    14|  <div style="display:flex;gap:1rem;">
    15|    <label style="cursor:pointer;display:flex;align-items:center;gap:0.3rem;">
    16|      <input type="radio" x-model="direction" value="ah2cca" @change="convert()"> <strong>Ah → CCA</strong>
    17|    </label>
    18|    <label style="cursor:pointer;display:flex;align-items:center;gap:0.3rem;">
    19|      <input type="radio" x-model="direction" value="cca2ah" @change="convert()"> <strong>CCA → Ah</strong>
    20|    </label>
    21|  </div>
    22|</div>
    23|
    24|<div x-show="direction === 'ah2cca'">
    25|  <div class="cg-form-group">
    26|    <label class="cg-label">Amp-hours (Ah)</label>
    27|    <input type="range" class="cg-slider" x-model.number="ahValue" min="20" max="250" step="1" @input="convert()">
    28|    <div style="display:flex;justify-content:space-between;max-width:420px;">
    29|      <span style="font-size:0.85rem;color:#6b7280;">20 Ah</span>
    30|      <span style="font-weight:700;color:var(--cg-purple-dark);" x-text="ahValue + ' Ah'"></span>
    31|      <span style="font-size:0.85rem;color:#6b7280;">250 Ah</span>
    32|    </div>
    33|    <input type="number" class="cg-input" x-model.number="ahValue" min="20" max="250" @input="convert()" style="margin-top:0.5rem;">
    34|  </div>
    35|</div>
    36|
    37|<div x-show="direction === 'cca2ah'">
    38|  <div class="cg-form-group">
    39|    <label class="cg-label">Cold Cranking Amps (CCA)</label>
    40|    <input type="range" class="cg-slider" x-model.number="ccaValue" min="100" max="2000" step="10" @input="convert()">
    41|    <div style="display:flex;justify-content:space-between;max-width:420px;">
    42|      <span style="font-size:0.85rem;color:#6b7280;">100 CCA</span>
    43|      <span style="font-weight:700;color:var(--cg-purple-dark);" x-text="ccaValue + ' CCA'"></span>
    44|      <span style="font-size:0.85rem;color:#6b7280;">2000 CCA</span>
    45|    </div>
    46|    <input type="number" class="cg-input" x-model.number="ccaValue" min="100" max="2000" @input="convert()" style="margin-top:0.5rem;">
    47|  </div>
    48|</div>
    49|
    50|<div class="cg-form-group">
    51|  <label class="cg-label">Conversion Ratio</label>
    52|  <input type="range" class="cg-slider" x-model.number="ratio" min="7" max="10" step="0.1" @input="convert()">
    53|  <div style="display:flex;justify-content:space-between;max-width:420px;">
    54|    <span style="font-size:0.85rem;color:#6b7280;">7:1 (reserve/small)</span>
    55|    <span style="font-weight:700;color:var(--cg-purple-dark);" x-text="ratio + ':1'"></span>
    56|    <span style="font-size:0.85rem;color:#6b7280;">10:1 (high-power)</span>
    57|  </div>
    58|</div>
    59|
    60|<!-- Result -->
    61|<div class="cg-result" x-show="direction === 'ah2cca'">
    62|  <h4>📊 Ah → CCA Conversion</h4>
    63|  <div class="spec-row"><span class="spec-label">Input</span><span class="spec-value" x-text="ahValue + ' Ah'"></span></div>
    64|  <div class="spec-row"><span class="spec-label">Ratio</span><span class="spec-value" x-text="ratio + ':1'"></span></div>
    65|  <div class="spec-row" style="font-size:1.2rem;border-bottom:2px solid var(--cg-purple);">
    66|    <span class="spec-label">Estimated CCA Range</span>
    67|    <span class="spec-value" x-text="lowCca + ' — ' + highCca + ' CCA'"></span>
    68|  </div>
    69|  <div x-show="direction === 'ah2cca'" style="margin-top:0.5rem;color:#6b7280;font-size:0.9rem;">
    70|    Midpoint: <strong x-text="midCca + ' CCA'"></strong>
    71|  </div>
    72|</div>
    73|
    74|<div class="cg-result" x-show="direction === 'cca2ah'" style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-left-color: #22c55e;">
    75|  <h4>📊 CCA → Ah Conversion</h4>
    76|  <div class="spec-row"><span class="spec-label">Input</span><span class="spec-value" x-text="ccaValue + ' CCA'"></span></div>
    77|  <div class="spec-row"><span class="spec-label">Ratio</span><span class="spec-value" x-text="ratio + ':1'"></span></div>
    78|  <div class="spec-row" style="font-size:1.2rem;border-bottom:2px solid #22c55e;">
    79|    <span class="spec-label">Estimated Ah Range</span>
    80|    <span class="spec-value" x-text="lowAh + ' — ' + highAh + ' Ah'"></span>
    81|  </div>
    82|  <div x-show="direction === 'cca2ah'" style="margin-top:0.5rem;color:#6b7280;font-size:0.9rem;">
    83|    Midpoint: <strong x-text="midAh + ' Ah'"></strong>
    84|  </div>
    85|</div>
    86|
    87|<!-- Matching models -->
    88|<div x-show="matchingModels.length > 0" style="margin-top:1rem;">
    89|  <strong>🔋 Matching Chengguang Models:</strong>
    90|  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem;">
    91|    <template x-for="m in matchingModels" :key="m.model">
    92|      <span style="display:inline-block;background:#ede9fe;color:#4c1d95;padding:6px 12px;border-radius:20px;font-weight:600;font-size:0.9rem;" x-text="m.model + ' (' + m.cca + ' CCA, ' + m.ah + 'Ah)'"></span>
    93|    </template>
    94|  </div>
    95|</div>
    96|
    97|<div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    98|  <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
    99|  <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Battery Datasheets</a>
   100|</div>
   101|
   102|<div class="cg-warning">
   103|  ⚠️ <strong>Note:</strong> CCA and Ah measure different properties. CCA measures starting power (cold cranking), while Ah measures capacity. The 7:1 to 10:1 ratio is a rough approximation. Always consult the manufacturer datasheet for exact specifications.
   104|</div>
   105|
   106|</div>
   107|
   108|<script>
   109|function ahCcaConverter() {
   110|  return {
   111|    direction: 'ah2cca',
   112|    ahValue: 60,
   113|    ccaValue: 500,
   114|    ratio: 8.5,
   115|    lowCca: 0, highCca: 0, midCca: 0,
   116|    lowAh: 0, highAh: 0, midAh: 0,
   117|    matchingModels: [],
   118|
   119|    batteryModels: [
   120|      { model: 'CG-55B24', cca: 370, ah: 45 },
   121|      { model: 'CG-55D23', cca: 500, ah: 60 },
   122|      { model: 'CG-65D26', cca: 520, ah: 65 },
   123|      { model: 'CG-95E41', cca: 750, ah: 80 },
   124|      { model: 'CG-105D31', cca: 650, ah: 75 },
   125|      { model: 'CG-145G51', cca: 850, ah: 90 },
   126|      { model: 'CG-190H52', cca: 1100, ah: 110 },
   127|      { model: 'CG-56638', cca: 540, ah: 66 },
   128|      { model: 'CG-DIN58043', cca: 580, ah: 74 },
   129|      { model: 'CG-DIN60038', cca: 870, ah: 100 }
   130|    ],
   131|
   132|    convert() {
   133|      if (this.direction === 'ah2cca') {
   134|        this.lowCca = Math.round(this.ahValue * 7);
   135|        this.highCca = Math.round(this.ahValue * 10);
   136|        this.midCca = Math.round(this.ahValue * this.ratio);
   137|        // Find models near the midpoint
   138|        this.matchingModels = this.batteryModels
   139|          .filter(m => m.cca >= this.lowCca && m.cca <= this.highCca)
   140|          .sort((a, b) => a.cca - b.cca);
   141|      } else {
   142|        this.lowAh = Math.round(this.ccaValue / 10);
   143|        this.highAh = Math.round(this.ccaValue / 7);
   144|        this.midAh = Math.round(this.ccaValue / this.ratio);
   145|        this.matchingModels = this.batteryModels
   146|          .filter(m => m.ah >= this.lowAh && m.ah <= this.highAh)
   147|          .sort((a, b) => a.ah - b.ah);
   148|      }
   149|    },
   150|
   151|    init() {
   152|      this.convert();
   153|    }
   154|  };
   155|}
   156|</script>
   157|
   158|---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Ah↔CCA Converter",
  "url": "https://tool.chengguangenergy.com/ah-cca-converter/",
  "description": "Quick bidirectional conversion between Amp-hours (Ah) and Cold Cranking Amps (CCA) for lead-acid automotive batteries.",
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


   159|
   160|<div class="ecosystem-footer" x-data="ecosystem">
   161|<h4>🌐 Explore the Chengguang Ecosystem</h4>
   162|<div class="ecosystem-links">
   163|  <template x-for="site in sites" :key="site.url">
   164|    <a :href="site.url" class="eco-link" :class="{ active: site.active }" x-text="site.name" target="_blank"></a>
   165|  </template>
   166|</div>
   167|</div>
   168|

---

## :material-help-circle: Frequently Asked Questions

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you convert Ah to CCA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "There is no exact formula — Ah and CCA measure different things. CCA ≈ Ah × 7 to 10 is a rough rule of thumb for lead-acid batteries. A 60Ah battery typically delivers 420-600 CCA. The exact ratio depends on battery design, plate thickness, and manufacturer."
      }
    },
    {
      "@type": "Question",
      "name": "Why can't Ah and CCA be precisely converted?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ah (Amp-hours) measures energy storage capacity — how long the battery can deliver current. CCA (Cold Cranking Amps) measures peak power delivery — how much current the battery can deliver briefly at 0°F. A battery can have high CCA but low Ah (racing battery) or high Ah but low CCA (deep cycle battery)."
      }
    },
    {
      "@type": "Question",
      "name": "Is a higher CCA battery always better?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For starting, yes — higher CCA means more cranking power. But very high CCA batteries may have thinner plates optimized for current delivery rather than deep cycling. Choose CCA appropriate for your engine, not the highest available."
      }
    },
    {
      "@type": "Question",
      "name": "What Ah battery do I need for a 600 CCA requirement?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Using the 7:1 to 10:1 conversion range, a 600 CCA battery typically has 60-85 Ah. In practice, most 600 CCA batteries are 60-70 Ah."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this converter for AGM or lithium batteries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 7-10× ratio is specific to flooded lead-acid batteries. AGM batteries typically have a slightly higher CCA-to-Ah ratio (8-11×). Lithium (LiFePO4) batteries have entirely different characteristics and this converter should not be used for them."
      }
    }
  ]
}

</script>

### How do you convert Ah to CCA?
There is no exact formula — Ah and CCA measure different things. CCA ≈ Ah × 7 to 10 is a rough rule of thumb for lead-acid batteries. A 60Ah battery typically delivers 420-600 CCA. The exact ratio depends on battery design, plate thickness, and manufacturer.

### Why can't Ah and CCA be precisely converted?
Ah (Amp-hours) measures energy storage capacity — how long the battery can deliver current. CCA (Cold Cranking Amps) measures peak power delivery — how much current the battery can deliver briefly at 0°F. A battery can have high CCA but low Ah (racing battery) or high Ah but low CCA (deep cycle battery).

### Is a higher CCA battery always better?
For starting, yes — higher CCA means more cranking power. But very high CCA batteries may have thinner plates optimized for current delivery rather than deep cycling. Choose CCA appropriate for your engine, not the highest available.

### What Ah battery do I need for a 600 CCA requirement?
Using the 7:1 to 10:1 conversion range, a 600 CCA battery typically has 60-85 Ah. In practice, most 600 CCA batteries are 60-70 Ah.

### Can I use this converter for AGM or lithium batteries?
The 7-10× ratio is specific to flooded lead-acid batteries. AGM batteries typically have a slightly higher CCA-to-Ah ratio (8-11×). Lithium (LiFePO4) batteries have entirely different characteristics and this converter should not be used for them.



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
