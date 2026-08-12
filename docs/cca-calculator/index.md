# ❄️ CCA Calculator

Calculate the recommended Cold Cranking Amps (CCA) for your vehicle based on engine specifications.

**Formula:** `Base CCA = Displacement × Factor × Temperature Multiplier`

---

<div x-data="ccaCalculator()" class="tool-card">

### Engine Parameters

<div class="cg-form-group">
  <label class="cg-label">Engine Displacement (L)</label>
  <input type="number" class="cg-input" x-model.number="displacement" min="0.5" max="16" step="0.1" placeholder="e.g. 2.5">
</div>

<div class="cg-form-group">
  <label class="cg-label">Fuel Type</label>
  <select class="cg-select" x-model="fuelType">
    <option value="gasoline">Gasoline (Petrol)</option>
    <option value="diesel">Diesel</option>
  </select>
  <small style="color:#6b7280;">Factor: Gasoline = 170, Diesel = 300</small>
</div>

<div class="cg-form-group">
  <label class="cg-label">Lowest Expected Temperature</label>
  <select class="cg-select" x-model="tempRange">
    <option value="1.0">Above 0°C (32°F) — Multiplier: 1.0</option>
    <option value="1.2">0°C to -10°C (32°F to 14°F) — Multiplier: 1.2</option>
    <option value="1.5">-10°C to -20°C (14°F to -4°F) — Multiplier: 1.5</option>
    <option value="1.8">-20°C to -30°C (-4°F to -22°F) — Multiplier: 1.8</option>
    <option value="2.2">Below -30°C (-22°F) — Multiplier: 2.2</option>
  </select>
</div>

<button class="cg-btn" @click="calculate()" :disabled="!canCalculate">🧮 Calculate CCA</button>

<!-- Result -->
<div x-show="result" x-transition class="cg-result" style="display:none;">
  <h4>📊 Calculation Results</h4>
  <div class="spec-row"><span class="spec-label">Displacement</span><span class="spec-value" x-text="displacement + ' L'"></span></div>
  <div class="spec-row"><span class="spec-label">Fuel Factor</span><span class="spec-value" x-text="fuelFactor"></span></div>
  <div class="spec-row"><span class="spec-label">Temperature Multiplier</span><span class="spec-value" x-text="'×' + tempRange"></span></div>
  <div class="spec-row" style="font-size:1.1rem;border-bottom:2px solid var(--cg-purple);">
    <span class="spec-label">Recommended CCA</span>
    <span class="spec-value" x-text="resultCca + ' A'"></span>
  </div>
  <div style="margin-top:1rem;">
    <strong>🔋 Matching Chengguang Models:</strong>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem;" x-html="matchingModelsHtml"></div>
  </div>
  <div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
    <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Browse All Models</a>
  </div>
</div>

</div>

<script>
function ccaCalculator() {
  return {
    displacement: '',
    fuelType: 'gasoline',
    tempRange: '1.0',
    result: false,
    resultCca: 0,
    fuelFactor: 0,
    matchingModelsHtml: '',

    // Chengguang model CCA specs
    batteryModels: [
      { model: 'CG-55B24', cca: 370, ah: 45, dims: '238×129×227 mm' },
      { model: 'CG-55D23', cca: 500, ah: 60, dims: '232×173×225 mm' },
      { model: 'CG-65D26', cca: 520, ah: 65, dims: '260×173×225 mm' },
      { model: 'CG-95E41', cca: 750, ah: 80, dims: '306×173×225 mm' },
      { model: 'CG-105D31', cca: 650, ah: 75, dims: '302×173×225 mm' },
      { model: 'CG-145G51', cca: 850, ah: 90, dims: '330×173×240 mm' },
      { model: 'CG-190H52', cca: 1100, ah: 110, dims: '350×173×240 mm' },
      { model: 'CG-56638', cca: 540, ah: 66, dims: '278×175×175 mm' },
      { model: 'CG-DIN58043', cca: 580, ah: 74, dims: '315×175×175 mm' },
      { model: 'CG-DIN60038', cca: 870, ah: 100, dims: '353×175×190 mm' }
    ],

    get canCalculate() {
      return this.displacement > 0;
    },

    calculate() {
      if (!this.canCalculate) return;
      const factor = this.fuelType === 'diesel' ? 300 : 170;
      const temp = parseFloat(this.tempRange);
      this.fuelFactor = factor;
      this.resultCca = Math.round(this.displacement * factor * temp);

      // Find matching models (CCA >= requested)
      const matches = this.batteryModels
        .filter(b => b.cca >= this.resultCca)
        .sort((a, b) => a.cca - b.cca);

      if (matches.length === 0) {
        this.matchingModelsHtml = '<span style="color:#ef4444;">No matching models. Please contact OEM for custom solution.</span>';
      } else {
        this.matchingModelsHtml = matches.map(m =>
          `<span style="display:inline-block;background:#ede9fe;color:#4c1d95;padding:6px 12px;border-radius:20px;font-weight:600;font-size:0.9rem;">${m.model} (${m.cca} CCA, ${m.ah}Ah)</span>`
        ).join('');
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
