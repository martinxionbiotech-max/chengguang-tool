# 🔄 JIS ↔ DIN Cross-Reference

Cross-reference between JIS (Japanese Industrial Standard) and DIN (Deutsches Institut für Normung) battery models.

---

<div x-data="crossReference()" class="tool-card">

### Select Battery to Cross-Reference

<div class="cg-form-group">
  <label class="cg-label">Battery Standard / Model</label>
  <select class="cg-select" x-model="selectedModel" @change="crossRef()">
    <option value="">-- Select a Model --</option>
    <optgroup label="JIS Models">
      <template x-for="m in jisModels" :key="m.model">
        <option :value="m.model" x-text="m.model + ' (' + m.cca + ' CCA, ' + m.ah + 'Ah)'"></option>
      </template>
    </optgroup>
    <optgroup label="DIN Models">
      <template x-for="m in dinModels" :key="m.model">
        <option :value="m.model" x-text="m.model + ' (' + m.cca + ' CCA, ' + m.ah + 'Ah)'"></option>
      </template>
    </optgroup>
  </select>
</div>

<!-- Result -->
<div x-show="result" x-transition style="display:none;">

<div class="cg-result">
  <h4>📋 Selected Battery</h4>
  <div class="spec-row"><span class="spec-label">Model</span><span class="spec-value" x-text="srcModel"></span></div>
  <div class="spec-row"><span class="spec-label">Standard</span><span class="spec-value" x-text="srcStandard"></span></div>
  <div class="spec-row"><span class="spec-label">CCA</span><span class="spec-value" x-text="srcCca + ' A'"></span></div>
  <div class="spec-row"><span class="spec-label">Capacity</span><span class="spec-value" x-text="srcAh + ' Ah'"></span></div>
  <div class="spec-row"><span class="spec-label">Dimensions</span><span class="spec-value" x-text="srcDims"></span></div>
  <div class="spec-row"><span class="spec-label">Terminal</span><span class="spec-value" x-text="srcTerminal"></span></div>
</div>

<h4 style="margin-top:1.5rem;">↔️ Closest Equivalent in <span x-text="targetStandard"></span></h4>

<div class="cg-result" style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-left-color: #22c55e;">
  <div class="spec-row"><span class="spec-label">Model</span><span class="spec-value" x-text="equivModel"></span></div>
  <div class="spec-row"><span class="spec-label">Standard</span><span class="spec-value" x-text="targetStandard"></span></div>
  <div class="spec-row"><span class="spec-label">CCA</span><span class="spec-value" x-text="equivCca + ' A'"></span></div>
  <div class="spec-row"><span class="spec-label">Capacity</span><span class="spec-value" x-text="equivAh + ' Ah'"></span></div>
  <div class="spec-row"><span class="spec-label">Dimensions</span><span class="spec-value" x-text="equivDims"></span></div>
  <div class="spec-row"><span class="spec-label">Terminal</span><span class="spec-value" x-text="equivTerminal"></span></div>
</div>

<div class="cg-warning" x-show="fitWarning" x-text="fitWarning"></div>

<div x-show="!fitWarning" style="color:#22c55e;padding:0.8rem 1.2rem;margin:0.5rem 0;font-weight:600;">
  ✅ Dimensions and terminal type are compatible. Safe to substitute.
</div>

<div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
  <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
  <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Full Datasheet</a>
</div>

</div>

</div>

<script>
function crossReference() {
  return {
    selectedModel: '',
    result: false,
    srcModel: '', srcStandard: '', srcCca: '', srcAh: '', srcDims: '', srcTerminal: '',
    equivModel: '', targetStandard: '', equivCca: '', equivAh: '', equivDims: '', equivTerminal: '',
    fitWarning: '',

    jisModels: [
      { model: 'CG-55B24', standard: 'JIS', cca: 370, ah: 45, dims: '238×129×227 mm', terminal: 'JIS T1 (pencil post)' },
      { model: 'CG-55D23', standard: 'JIS', cca: 500, ah: 60, dims: '232×173×225 mm', terminal: 'SAE post' },
      { model: 'CG-65D26', standard: 'JIS', cca: 520, ah: 65, dims: '260×173×225 mm', terminal: 'SAE post' },
      { model: 'CG-95E41', standard: 'JIS', cca: 750, ah: 80, dims: '306×173×225 mm', terminal: 'SAE post' },
      { model: 'CG-105D31', standard: 'JIS', cca: 650, ah: 75, dims: '302×173×225 mm', terminal: 'SAE post' },
      { model: 'CG-145G51', standard: 'JIS', cca: 850, ah: 90, dims: '330×173×240 mm', terminal: 'SAE post' },
      { model: 'CG-190H52', standard: 'JIS', cca: 1100, ah: 110, dims: '350×173×240 mm', terminal: 'SAE post' }
    ],
    dinModels: [
      { model: 'CG-56638', standard: 'DIN', cca: 540, ah: 66, dims: '278×175×175 mm', terminal: 'SAE post' },
      { model: 'CG-DIN58043', standard: 'DIN', cca: 580, ah: 74, dims: '315×175×175 mm', terminal: 'SAE post' },
      { model: 'CG-DIN60038', standard: 'DIN', cca: 870, ah: 100, dims: '353×175×190 mm', terminal: 'SAE post' }
    ],

    // Cross-reference mapping
    crossMap: {
      'CG-55B24': 'CG-56638', 'CG-55D23': 'CG-DIN58043', 'CG-65D26': 'CG-DIN58043',
      'CG-95E41': 'CG-DIN60038', 'CG-105D31': 'CG-DIN60038', 'CG-145G51': 'CG-DIN60038',
      'CG-190H52': 'CG-DIN60038',
      'CG-56638': 'CG-55B24', 'CG-DIN58043': 'CG-55D23', 'CG-DIN60038': 'CG-95E41'
    },

    allModels() {
      return [...this.jisModels, ...this.dinModels];
    },

    crossRef() {
      if (!this.selectedModel) { this.result = false; return; }
      const all = this.allModels();
      const src = all.find(m => m.model === this.selectedModel);
      if (!src) return;

      this.srcModel = src.model;
      this.srcStandard = src.standard;
      this.srcCca = src.cca;
      this.srcAh = src.ah;
      this.srcDims = src.dims;
      this.srcTerminal = src.terminal;

      this.targetStandard = src.standard === 'JIS' ? 'DIN' : 'JIS';
      const equivKey = this.crossMap[src.model];
      const equiv = all.find(m => m.model === equivKey);

      if (equiv) {
        this.equivModel = equiv.model;
        this.equivCca = equiv.cca;
        this.equivAh = equiv.ah;
        this.equivDims = equiv.dims;
        this.equivTerminal = equiv.terminal;

        // Fit compatibility check
        if (src.terminal !== equiv.terminal) {
          this.fitWarning = `⚠️ Terminal types differ: ${src.terminal} vs ${equiv.terminal}. Verify compatibility before substituting.`;
        } else if (src.model === 'CG-55B24') {
          this.fitWarning = `⚠️ Size mismatch: JIS 55B24 (238×129×227) vs DIN 56638 (278×175×175). The DIN battery is significantly larger — verify tray clearance!`;
        } else {
          this.fitWarning = '';
        }
      }

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
