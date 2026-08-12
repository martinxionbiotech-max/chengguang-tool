     1|# 🔍 Battery Finder
     2|
     3|Find the correct Chengguang battery for your vehicle in 4 easy steps.
     4|
     5|---
     6|
     7|<div x-data="batteryFinder()" class="tool-card">
     8|
     9|### Step 1: Select Make
    10|
    11|<div class="cg-form-group">
    12|  <label class="cg-label">Vehicle Make</label>
    13|  <select class="cg-select" x-model="selectedMake" @change="onMakeChange()">
    14|    <option value="">-- Select Make --</option>
    15|    <template x-for="b in brands" :key="b.make">
    16|      <option :value="b.make" x-text="b.make"></option>
    17|    </template>
    18|  </select>
    19|</div>
    20|
    21|### Step 2: Select Model
    22|
    23|<div class="cg-form-group">
    24|  <label class="cg-label">Vehicle Model</label>
    25|  <select class="cg-select" x-model="selectedModel" :disabled="!selectedMake" @change="onModelChange()">
    26|    <option value="">-- Select Model --</option>
    27|    <template x-for="m in availableModels" :key="m.name">
    28|      <option :value="m.name" x-text="m.name + ' (' + m.years + ')'"></option>
    29|    </template>
    30|  </select>
    31|</div>
    32|
    33|### Step 3: Select Engine
    34|
    35|<div class="cg-form-group">
    36|  <label class="cg-label">Engine Option</label>
    37|  <select class="cg-select" x-model="selectedEngine" :disabled="!selectedModel">
    38|    <option value="">-- Select Engine --</option>
    39|    <template x-for="(e, idx) in availableEngines" :key="idx">
    40|      <option :value="idx" x-text="e.label"></option>
    41|    </template>
    42|  </select>
    43|</div>
    44|
    45|### Step 4: Select Region
    46|
    47|<div class="cg-form-group">
    48|  <label class="cg-label">Your Region</label>
    49|  <select class="cg-select" x-model="selectedRegion">
    50|    <option value="">-- Select Region --</option>
    51|    <template x-for="r in regions" :key="r.code">
    52|      <option :value="r.code" x-text="r.name + ' — ' + r.note"></option>
    53|    </template>
    54|  </select>
    55|</div>
    56|
    57|<button class="cg-btn" @click="findBattery()" :disabled="!canSearch">🔍 Find My Battery</button>
    58|
    59|<!-- Result -->
    60|<div x-show="result" x-transition class="cg-result" style="display:none;">
    61|  <h4>✅ Recommended Chengguang Battery</h4>
    62|  <div class="spec-row"><span class="spec-label">Vehicle</span><span class="spec-value" x-text="resultVehicle"></span></div>
    63|  <div class="spec-row"><span class="spec-label">Engine</span><span class="spec-value" x-text="resultEngine"></span></div>
    64|  <div class="spec-row"><span class="spec-label">Chengguang Model</span><span class="spec-value" x-text="resultModel"></span></div>
    65|  <div class="spec-row"><span class="spec-label">CCA</span><span class="spec-value" x-text="resultCca + ' A'"></span></div>
    66|  <div class="spec-row"><span class="spec-label">Capacity</span><span class="spec-value" x-text="resultAh + ' Ah'"></span></div>
    67|  <div class="spec-row"><span class="spec-label">Dimensions</span><span class="spec-value" x-text="resultDims"></span></div>
    68|  <div class="spec-row"><span class="spec-label">Terminal Type</span><span class="spec-value" x-text="resultTerminal"></span></div>
    69|  <div class="spec-row"><span class="spec-label">Type</span><span class="spec-value" x-text="resultType"></span></div>
    70|  <p style="margin-top:1rem;color:#4c1d95;" x-text="resultDesc"></p>
    71|  <div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    72|    <a :href="'https://oem.chengguangenergy.com/inquire?model=' + encodeURIComponent(resultModel)" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
    73|    <a :href="'https://data.chengguangenergy.com/batteries/' + encodeURIComponent(resultModel)" class="cg-btn cg-btn-outline" target="_blank">📊 View Datasheet</a>
    74|  </div>
    75|</div>
    76|
    77|<div x-show="noResult" x-transition class="cg-warning" style="display:none;">
    78|  ⚠️ No exact match found. Please <a href="https://oem.chengguangenergy.com/contact" target="_blank">contact our OEM team</a> for a custom recommendation.
    79|</div>
    80|
    81|</div>
    82|
    83|<script>
    84|function batteryFinder() {
    85|  return {
    86|    brands: [],
    87|    regions: [],
    88|    batterySpecs: {},
    89|    selectedMake: '',
    90|    selectedModel: '',
    91|    selectedEngine: '',
    92|    selectedRegion: '',
    93|    result: false,
    94|    noResult: false,
    95|    resultVehicle: '',
    96|    resultEngine: '',
    97|    resultModel: '',
    98|    resultCca: '',
    99|    resultAh: '',
   100|    resultDims: '',
   101|    resultTerminal: '',
   102|    resultType: '',
   103|    resultDesc: '',
   104|
   105|    get canSearch() {
   106|      return this.selectedMake && this.selectedModel && (this.selectedEngine !== '') && this.selectedRegion;
   107|    },
   108|
   109|    get availableModels() {
   110|      if (!this.selectedMake) return [];
   111|      const brand = this.brands.find(b => b.make === this.selectedMake);
   112|      return brand ? brand.models : [];
   113|    },
   114|
   115|    get availableEngines() {
   116|      if (!this.selectedMake || !this.selectedModel) return [];
   117|      const brand = this.brands.find(b => b.make === this.selectedMake);
   118|      if (!brand) return [];
   119|      const model = brand.models.find(m => m.name === this.selectedModel);
   120|      return model ? model.engines : [];
   121|    },
   122|
   123|    async init() {
   124|      try {
   125|        const resp = await fetch('/finder/brands.json');
   126|        const data = await resp.json();
   127|        this.brands = data.brands;
   128|        this.regions = data.regions;
   129|        this.batterySpecs = data.batterySpecs;
   130|      } catch (e) {
   131|        console.error('Failed to load battery database', e);
   132|      }
   133|    },
   134|
   135|    onMakeChange() {
   136|      this.selectedModel = '';
   137|      this.selectedEngine = '';
   138|      this.result = false;
   139|      this.noResult = false;
   140|    },
   141|
   142|    onModelChange() {
   143|      this.selectedEngine = '';
   144|      this.result = false;
   145|      this.noResult = false;
   146|    },
   147|
   148|    findBattery() {
   149|      if (!this.canSearch) return;
   150|      const brand = this.brands.find(b => b.make === this.selectedMake);
   151|      const model = brand.models.find(m => m.name === this.selectedModel);
   152|      const engine = model.engines[this.selectedEngine];
   153|      const spec = this.batterySpecs[engine.battery];
   154|
   155|      if (!spec) {
   156|        this.result = false;
   157|        this.noResult = true;
   158|        return;
   159|      }
   160|
   161|      this.resultVehicle = `${this.selectedMake} ${this.selectedModel} (${model.years})`;
   162|      this.resultEngine = engine.label;
   163|      this.resultModel = spec.model;
   164|      this.resultCca = spec.cca;
   165|      this.resultAh = spec.ah;
   166|      this.resultDims = spec.dimensions;
   167|      this.resultTerminal = spec.terminal;
   168|      this.resultType = spec.type;
   169|      this.resultDesc = spec.description;
   170|      this.result = true;
   171|      this.noResult = false;
   172|    }
   173|  };
   174|}
   175|</script>
   176|
   177|---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Battery Finder",
  "url": "https://tool.chengguangenergy.com/finder/",
  "description": "Find the correct Chengguang battery for your vehicle — select make, model, engine, and region to get the recommended battery model with full specifications.",
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


   178|
   179|<div class="ecosystem-footer" x-data="ecosystem">
   180|<h4>🌐 Explore the Chengguang Ecosystem</h4>
   181|<div class="ecosystem-links">
   182|  <template x-for="site in sites" :key="site.url">
   183|    <a :href="site.url" class="eco-link" :class="{ active: site.active }" x-text="site.name" target="_blank"></a>
   184|  </template>
   185|</div>
   186|</div>
   187|

---

## :material-help-circle: Frequently Asked Questions

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I find the right battery for my car?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Select your vehicle's Make → Model → Engine → Region. The tool will show the matching Chengguang battery model with specifications. You can also check your owner's manual or the label on your current battery."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use the Battery Finder for any vehicle brand?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Finder database covers major Japanese, European, and American brands sold in global markets. If your specific model is not listed, [contact us](https://chengguangenergy.com/contact/) with your vehicle details."
      }
    },
    {
      "@type": "Question",
      "name": "What if my vehicle uses a DIN battery but only JIS results show?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many vehicles accept both standards with adapter trays. Use our [JIS↔DIN Cross-Reference tool](../cross-reference/index.md) to find the equivalent DIN model."
      }
    },
    {
      "@type": "Question",
      "name": "How do I know the battery will physically fit?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Finder displays battery dimensions (L×W×H in mm). Before ordering, measure your battery tray and compare. JIS batteries use B00 hold-down (top frame); DIN batteries use B13 (bottom rail)."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this tool for commercial fleet purchasing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Distributors and fleet managers can use the Finder to standardize battery models across their vehicle fleet. For bulk OEM pricing, [request a quote](https://chengguangenergy.com/contact/)."
      }
    },
    {
      "@type": "Question",
      "name": "What do I do after finding my battery model?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Note the model number and [browse full specifications](https://data.chengguangenergy.com/battery-models/) on our Battery Database, or [start the OEM inquiry process](https://oem.chengguangenergy.com/oem-process/)."
      }
    }
  ]
}

</script>

### How do I find the right battery for my car?
Select your vehicle's Make → Model → Engine → Region. The tool will show the matching Chengguang battery model with specifications. You can also check your owner's manual or the label on your current battery.

### Can I use the Battery Finder for any vehicle brand?
The Finder database covers major Japanese, European, and American brands sold in global markets. If your specific model is not listed, [contact us](https://chengguangenergy.com/contact/) with your vehicle details.

### What if my vehicle uses a DIN battery but only JIS results show?
Many vehicles accept both standards with adapter trays. Use our [JIS↔DIN Cross-Reference tool](../cross-reference/index.md) to find the equivalent DIN model.

### How do I know the battery will physically fit?
The Finder displays battery dimensions (L×W×H in mm). Before ordering, measure your battery tray and compare. JIS batteries use B00 hold-down (top frame); DIN batteries use B13 (bottom rail).

### Can I use this tool for commercial fleet purchasing?
Yes. Distributors and fleet managers can use the Finder to standardize battery models across their vehicle fleet. For bulk OEM pricing, [request a quote](https://chengguangenergy.com/contact/).

### What do I do after finding my battery model?
Note the model number and [browse full specifications](https://data.chengguangenergy.com/battery-models/) on our Battery Database, or [start the OEM inquiry process](https://oem.chengguangenergy.com/oem-process/).



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
