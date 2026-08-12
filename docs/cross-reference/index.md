     1|# 🔄 JIS ↔ DIN Cross-Reference
     2|
     3|Cross-reference between JIS (Japanese Industrial Standard) and DIN (Deutsches Institut für Normung) battery models.
     4|
     5|---
     6|
     7|<div x-data="crossReference()" class="tool-card">
     8|
     9|### Select Battery to Cross-Reference
    10|
    11|<div class="cg-form-group">
    12|  <label class="cg-label">Battery Standard / Model</label>
    13|  <select class="cg-select" x-model="selectedModel" @change="crossRef()">
    14|    <option value="">-- Select a Model --</option>
    15|    <optgroup label="JIS Models">
    16|      <template x-for="m in jisModels" :key="m.model">
    17|        <option :value="m.model" x-text="m.model + ' (' + m.cca + ' CCA, ' + m.ah + 'Ah)'"></option>
    18|      </template>
    19|    </optgroup>
    20|    <optgroup label="DIN Models">
    21|      <template x-for="m in dinModels" :key="m.model">
    22|        <option :value="m.model" x-text="m.model + ' (' + m.cca + ' CCA, ' + m.ah + 'Ah)'"></option>
    23|      </template>
    24|    </optgroup>
    25|  </select>
    26|</div>
    27|
    28|<!-- Result -->
    29|<div x-show="result" x-transition style="display:none;">
    30|
    31|<div class="cg-result">
    32|  <h4>📋 Selected Battery</h4>
    33|  <div class="spec-row"><span class="spec-label">Model</span><span class="spec-value" x-text="srcModel"></span></div>
    34|  <div class="spec-row"><span class="spec-label">Standard</span><span class="spec-value" x-text="srcStandard"></span></div>
    35|  <div class="spec-row"><span class="spec-label">CCA</span><span class="spec-value" x-text="srcCca + ' A'"></span></div>
    36|  <div class="spec-row"><span class="spec-label">Capacity</span><span class="spec-value" x-text="srcAh + ' Ah'"></span></div>
    37|  <div class="spec-row"><span class="spec-label">Dimensions</span><span class="spec-value" x-text="srcDims"></span></div>
    38|  <div class="spec-row"><span class="spec-label">Terminal</span><span class="spec-value" x-text="srcTerminal"></span></div>
    39|</div>
    40|
    41|<h4 style="margin-top:1.5rem;">↔️ Closest Equivalent in <span x-text="targetStandard"></span></h4>
    42|
    43|<div class="cg-result" style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-left-color: #22c55e;">
    44|  <div class="spec-row"><span class="spec-label">Model</span><span class="spec-value" x-text="equivModel"></span></div>
    45|  <div class="spec-row"><span class="spec-label">Standard</span><span class="spec-value" x-text="targetStandard"></span></div>
    46|  <div class="spec-row"><span class="spec-label">CCA</span><span class="spec-value" x-text="equivCca + ' A'"></span></div>
    47|  <div class="spec-row"><span class="spec-label">Capacity</span><span class="spec-value" x-text="equivAh + ' Ah'"></span></div>
    48|  <div class="spec-row"><span class="spec-label">Dimensions</span><span class="spec-value" x-text="equivDims"></span></div>
    49|  <div class="spec-row"><span class="spec-label">Terminal</span><span class="spec-value" x-text="equivTerminal"></span></div>
    50|</div>
    51|
    52|<div class="cg-warning" x-show="fitWarning" x-text="fitWarning"></div>
    53|
    54|<div x-show="!fitWarning" style="color:#22c55e;padding:0.8rem 1.2rem;margin:0.5rem 0;font-weight:600;">
    55|  ✅ Dimensions and terminal type are compatible. Safe to substitute.
    56|</div>
    57|
    58|<div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    59|  <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
    60|  <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Full Datasheet</a>
    61|</div>
    62|
    63|</div>
    64|
    65|</div>
    66|
    67|<script>
    68|function crossReference() {
    69|  return {
    70|    selectedModel: '',
    71|    result: false,
    72|    srcModel: '', srcStandard: '', srcCca: '', srcAh: '', srcDims: '', srcTerminal: '',
    73|    equivModel: '', targetStandard: '', equivCca: '', equivAh: '', equivDims: '', equivTerminal: '',
    74|    fitWarning: '',
    75|
    76|    jisModels: [
    77|      { model: 'CG-55B24', standard: 'JIS', cca: 370, ah: 45, dims: '238×129×227 mm', terminal: 'JIS T1 (pencil post)' },
    78|      { model: 'CG-55D23', standard: 'JIS', cca: 500, ah: 60, dims: '232×173×225 mm', terminal: 'SAE post' },
    79|      { model: 'CG-65D26', standard: 'JIS', cca: 520, ah: 65, dims: '260×173×225 mm', terminal: 'SAE post' },
    80|      { model: 'CG-95E41', standard: 'JIS', cca: 750, ah: 80, dims: '306×173×225 mm', terminal: 'SAE post' },
    81|      { model: 'CG-105D31', standard: 'JIS', cca: 650, ah: 75, dims: '302×173×225 mm', terminal: 'SAE post' },
    82|      { model: 'CG-145G51', standard: 'JIS', cca: 850, ah: 90, dims: '330×173×240 mm', terminal: 'SAE post' },
    83|      { model: 'CG-190H52', standard: 'JIS', cca: 1100, ah: 110, dims: '350×173×240 mm', terminal: 'SAE post' }
    84|    ],
    85|    dinModels: [
    86|      { model: 'CG-56638', standard: 'DIN', cca: 540, ah: 66, dims: '278×175×175 mm', terminal: 'SAE post' },
    87|      { model: 'CG-DIN58043', standard: 'DIN', cca: 580, ah: 74, dims: '315×175×175 mm', terminal: 'SAE post' },
    88|      { model: 'CG-DIN60038', standard: 'DIN', cca: 870, ah: 100, dims: '353×175×190 mm', terminal: 'SAE post' }
    89|    ],
    90|
    91|    // Cross-reference mapping
    92|    crossMap: {
    93|      'CG-55B24': 'CG-56638', 'CG-55D23': 'CG-DIN58043', 'CG-65D26': 'CG-DIN58043',
    94|      'CG-95E41': 'CG-DIN60038', 'CG-105D31': 'CG-DIN60038', 'CG-145G51': 'CG-DIN60038',
    95|      'CG-190H52': 'CG-DIN60038',
    96|      'CG-56638': 'CG-55B24', 'CG-DIN58043': 'CG-55D23', 'CG-DIN60038': 'CG-95E41'
    97|    },
    98|
    99|    allModels() {
   100|      return [...this.jisModels, ...this.dinModels];
   101|    },
   102|
   103|    crossRef() {
   104|      if (!this.selectedModel) { this.result = false; return; }
   105|      const all = this.allModels();
   106|      const src = all.find(m => m.model === this.selectedModel);
   107|      if (!src) return;
   108|
   109|      this.srcModel = src.model;
   110|      this.srcStandard = src.standard;
   111|      this.srcCca = src.cca;
   112|      this.srcAh = src.ah;
   113|      this.srcDims = src.dims;
   114|      this.srcTerminal = src.terminal;
   115|
   116|      this.targetStandard = src.standard === 'JIS' ? 'DIN' : 'JIS';
   117|      const equivKey = this.crossMap[src.model];
   118|      const equiv = all.find(m => m.model === equivKey);
   119|
   120|      if (equiv) {
   121|        this.equivModel = equiv.model;
   122|        this.equivCca = equiv.cca;
   123|        this.equivAh = equiv.ah;
   124|        this.equivDims = equiv.dims;
   125|        this.equivTerminal = equiv.terminal;
   126|
   127|        // Fit compatibility check
   128|        if (src.terminal !== equiv.terminal) {
   129|          this.fitWarning = `⚠️ Terminal types differ: ${src.terminal} vs ${equiv.terminal}. Verify compatibility before substituting.`;
   130|        } else if (src.model === 'CG-55B24') {
   131|          this.fitWarning = `⚠️ Size mismatch: JIS 55B24 (238×129×227) vs DIN 56638 (278×175×175). The DIN battery is significantly larger — verify tray clearance!`;
   132|        } else {
   133|          this.fitWarning = '';
   134|        }
   135|      }
   136|
   137|      this.result = true;
   138|    }
   139|  };
   140|}
   141|</script>
   142|
   143|---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JIS↔DIN Battery Cross-Reference",
  "url": "https://tool.chengguangenergy.com/cross-reference/",
  "description": "Cross-reference between JIS and DIN automotive battery standards with dimension comparison and fit compatibility warnings.",
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


   144|
   145|<div class="ecosystem-footer" x-data="ecosystem">
   146|<h4>🌐 Explore the Chengguang Ecosystem</h4>
   147|<div class="ecosystem-links">
   148|  <template x-for="site in sites" :key="site.url">
   149|    <a :href="site.url" class="eco-link" :class="{ active: site.active }" x-text="site.name" target="_blank"></a>
   150|  </template>
   151|</div>
   152|</div>
   153|

---

## :material-help-circle: Frequently Asked Questions

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I replace a JIS battery with a DIN battery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not directly without modifications. JIS and DIN batteries have different terminal types (T1 tab vs round post), case dimensions, and hold-down mechanisms (B00 top frame vs B13 bottom rail). You may need an adapter tray and terminal modifications."
      }
    },
    {
      "@type": "Question",
      "name": "What is the DIN equivalent of a 65D26 battery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The closest DIN equivalent to JIS 65D26 is DIN 56638 (DIN66). However, dimensions differ: 65D26 is 260×173×202mm while DIN66 is 278×175×175mm. The DIN battery is shorter and may require a height adapter."
      }
    },
    {
      "@type": "Question",
      "name": "Why are JIS and DIN standards different?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JIS (Japanese Industrial Standard) was developed for the Asian market where top-frame hold-down is standard. DIN (Deutsches Institut für Normung) was developed for European vehicles with bottom-rail clamping. They are architecturally different by design."
      }
    },
    {
      "@type": "Question",
      "name": "Can I cross-reference any JIS battery to any DIN battery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Only batteries with similar case widths (~173-175mm) have potential interchangeability. Even then, terminal type and hold-down differ. The cross-reference tool highlights fit compatibility for each pair."
      }
    },
    {
      "@type": "Question",
      "name": "What is the easiest way to convert my vehicle from JIS to DIN?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If your vehicle has adjustable or replaceable hold-down brackets, conversion is possible. You'll need: 1) the correct DIN battery model, 2) a tray adapter or modified bottom bracket, 3) possibly terminal adapters from T1 to round post."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to change anything else when switching battery standards?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Check: 1) Terminal cable reach — DIN terminals may be in different positions, 2) Battery tray dimensions — JIS trays are often taller, 3) Hood clearance — taller JIS batteries may not fit in DIN-designed engine bays."
      }
    }
  ]
}

</script>

### Can I replace a JIS battery with a DIN battery?
Not directly without modifications. JIS and DIN batteries have different terminal types (T1 tab vs round post), case dimensions, and hold-down mechanisms (B00 top frame vs B13 bottom rail). You may need an adapter tray and terminal modifications.

### What is the DIN equivalent of a 65D26 battery?
The closest DIN equivalent to JIS 65D26 is DIN 56638 (DIN66). However, dimensions differ: 65D26 is 260×173×202mm while DIN66 is 278×175×175mm. The DIN battery is shorter and may require a height adapter.

### Why are JIS and DIN standards different?
JIS (Japanese Industrial Standard) was developed for the Asian market where top-frame hold-down is standard. DIN (Deutsches Institut für Normung) was developed for European vehicles with bottom-rail clamping. They are architecturally different by design.

### Can I cross-reference any JIS battery to any DIN battery?
No. Only batteries with similar case widths (~173-175mm) have potential interchangeability. Even then, terminal type and hold-down differ. The cross-reference tool highlights fit compatibility for each pair.

### What is the easiest way to convert my vehicle from JIS to DIN?
If your vehicle has adjustable or replaceable hold-down brackets, conversion is possible. You'll need: 1) the correct DIN battery model, 2) a tray adapter or modified bottom bracket, 3) possibly terminal adapters from T1 to round post.

### Do I need to change anything else when switching battery standards?
Check: 1) Terminal cable reach — DIN terminals may be in different positions, 2) Battery tray dimensions — JIS trays are often taller, 3) Hood clearance — taller JIS batteries may not fit in DIN-designed engine bays.



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
