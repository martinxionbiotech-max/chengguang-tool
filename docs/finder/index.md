# 🔍 Battery Finder

Find the correct Chengguang battery for your vehicle in 4 easy steps.

---

<div x-data="batteryFinder()" class="tool-card">

### Step 1: Select Make

<div class="cg-form-group">
  <label class="cg-label">Vehicle Make</label>
  <select class="cg-select" x-model="selectedMake" @change="onMakeChange()">
    <option value="">-- Select Make --</option>
    <template x-for="b in brands" :key="b.make">
      <option :value="b.make" x-text="b.make"></option>
    </template>
  </select>
</div>

### Step 2: Select Model

<div class="cg-form-group">
  <label class="cg-label">Vehicle Model</label>
  <select class="cg-select" x-model="selectedModel" :disabled="!selectedMake" @change="onModelChange()">
    <option value="">-- Select Model --</option>
    <template x-for="m in availableModels" :key="m.name">
      <option :value="m.name" x-text="m.name + ' (' + m.years + ')'"></option>
    </template>
  </select>
</div>

### Step 3: Select Engine

<div class="cg-form-group">
  <label class="cg-label">Engine Option</label>
  <select class="cg-select" x-model="selectedEngine" :disabled="!selectedModel">
    <option value="">-- Select Engine --</option>
    <template x-for="(e, idx) in availableEngines" :key="idx">
      <option :value="idx" x-text="e.label"></option>
    </template>
  </select>
</div>

### Step 4: Select Region

<div class="cg-form-group">
  <label class="cg-label">Your Region</label>
  <select class="cg-select" x-model="selectedRegion">
    <option value="">-- Select Region --</option>
    <template x-for="r in regions" :key="r.code">
      <option :value="r.code" x-text="r.name + ' — ' + r.note"></option>
    </template>
  </select>
</div>

<button class="cg-btn" @click="findBattery()" :disabled="!canSearch">🔍 Find My Battery</button>

<!-- Result -->
<div x-show="result" x-transition class="cg-result" style="display:none;">
  <h4>✅ Recommended Chengguang Battery</h4>
  <div class="spec-row"><span class="spec-label">Vehicle</span><span class="spec-value" x-text="resultVehicle"></span></div>
  <div class="spec-row"><span class="spec-label">Engine</span><span class="spec-value" x-text="resultEngine"></span></div>
  <div class="spec-row"><span class="spec-label">Chengguang Model</span><span class="spec-value" x-text="resultModel"></span></div>
  <div class="spec-row"><span class="spec-label">CCA</span><span class="spec-value" x-text="resultCca + ' A'"></span></div>
  <div class="spec-row"><span class="spec-label">Capacity</span><span class="spec-value" x-text="resultAh + ' Ah'"></span></div>
  <div class="spec-row"><span class="spec-label">Dimensions</span><span class="spec-value" x-text="resultDims"></span></div>
  <div class="spec-row"><span class="spec-label">Terminal Type</span><span class="spec-value" x-text="resultTerminal"></span></div>
  <div class="spec-row"><span class="spec-label">Type</span><span class="spec-value" x-text="resultType"></span></div>
  <p style="margin-top:1rem;color:#4c1d95;" x-text="resultDesc"></p>
  <div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    <a :href="'https://oem.chengguangenergy.com/inquire?model=' + encodeURIComponent(resultModel)" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
    <a :href="'https://data.chengguangenergy.com/batteries/' + encodeURIComponent(resultModel)" class="cg-btn cg-btn-outline" target="_blank">📊 View Datasheet</a>
  </div>
</div>

<div x-show="noResult" x-transition class="cg-warning" style="display:none;">
  ⚠️ No exact match found. Please <a href="https://oem.chengguangenergy.com/contact" target="_blank">contact our OEM team</a> for a custom recommendation.
</div>

</div>

<script>
function batteryFinder() {
  return {
    brands: [],
    regions: [],
    batterySpecs: {},
    selectedMake: '',
    selectedModel: '',
    selectedEngine: '',
    selectedRegion: '',
    result: false,
    noResult: false,
    resultVehicle: '',
    resultEngine: '',
    resultModel: '',
    resultCca: '',
    resultAh: '',
    resultDims: '',
    resultTerminal: '',
    resultType: '',
    resultDesc: '',

    get canSearch() {
      return this.selectedMake && this.selectedModel && (this.selectedEngine !== '') && this.selectedRegion;
    },

    get availableModels() {
      if (!this.selectedMake) return [];
      const brand = this.brands.find(b => b.make === this.selectedMake);
      return brand ? brand.models : [];
    },

    get availableEngines() {
      if (!this.selectedMake || !this.selectedModel) return [];
      const brand = this.brands.find(b => b.make === this.selectedMake);
      if (!brand) return [];
      const model = brand.models.find(m => m.name === this.selectedModel);
      return model ? model.engines : [];
    },

    async init() {
      try {
        const resp = await fetch('/finder/brands.json');
        const data = await resp.json();
        this.brands = data.brands;
        this.regions = data.regions;
        this.batterySpecs = data.batterySpecs;
      } catch (e) {
        console.error('Failed to load battery database', e);
      }
    },

    onMakeChange() {
      this.selectedModel = '';
      this.selectedEngine = '';
      this.result = false;
      this.noResult = false;
    },

    onModelChange() {
      this.selectedEngine = '';
      this.result = false;
      this.noResult = false;
    },

    findBattery() {
      if (!this.canSearch) return;
      const brand = this.brands.find(b => b.make === this.selectedMake);
      const model = brand.models.find(m => m.name === this.selectedModel);
      const engine = model.engines[this.selectedEngine];
      const spec = this.batterySpecs[engine.battery];

      if (!spec) {
        this.result = false;
        this.noResult = true;
        return;
      }

      this.resultVehicle = `${this.selectedMake} ${this.selectedModel} (${model.years})`;
      this.resultEngine = engine.label;
      this.resultModel = spec.model;
      this.resultCca = spec.cca;
      this.resultAh = spec.ah;
      this.resultDims = spec.dimensions;
      this.resultTerminal = spec.terminal;
      this.resultType = spec.type;
      this.resultDesc = spec.description;
      this.result = true;
      this.noResult = false;
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
