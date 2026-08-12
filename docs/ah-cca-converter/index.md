# 🔁 Ah ↔ CCA Converter

Bidirectional converter between Amp-hours (Ah) and Cold Cranking Amps (CCA).  
The relationship is approximate: **CCA ≈ Ah × 7 to 10** (varies by battery design).

---

<div x-data="ahCcaConverter()" class="tool-card">

### Converter

<div class="cg-form-group">
  <label class="cg-label">Conversion Direction</label>
  <div style="display:flex;gap:1rem;">
    <label style="cursor:pointer;display:flex;align-items:center;gap:0.3rem;">
      <input type="radio" x-model="direction" value="ah2cca" @change="convert()"> <strong>Ah → CCA</strong>
    </label>
    <label style="cursor:pointer;display:flex;align-items:center;gap:0.3rem;">
      <input type="radio" x-model="direction" value="cca2ah" @change="convert()"> <strong>CCA → Ah</strong>
    </label>
  </div>
</div>

<div x-show="direction === 'ah2cca'">
  <div class="cg-form-group">
    <label class="cg-label">Amp-hours (Ah)</label>
    <input type="range" class="cg-slider" x-model.number="ahValue" min="20" max="250" step="1" @input="convert()">
    <div style="display:flex;justify-content:space-between;max-width:420px;">
      <span style="font-size:0.85rem;color:#6b7280;">20 Ah</span>
      <span style="font-weight:700;color:var(--cg-purple-dark);" x-text="ahValue + ' Ah'"></span>
      <span style="font-size:0.85rem;color:#6b7280;">250 Ah</span>
    </div>
    <input type="number" class="cg-input" x-model.number="ahValue" min="20" max="250" @input="convert()" style="margin-top:0.5rem;">
  </div>
</div>

<div x-show="direction === 'cca2ah'">
  <div class="cg-form-group">
    <label class="cg-label">Cold Cranking Amps (CCA)</label>
    <input type="range" class="cg-slider" x-model.number="ccaValue" min="100" max="2000" step="10" @input="convert()">
    <div style="display:flex;justify-content:space-between;max-width:420px;">
      <span style="font-size:0.85rem;color:#6b7280;">100 CCA</span>
      <span style="font-weight:700;color:var(--cg-purple-dark);" x-text="ccaValue + ' CCA'"></span>
      <span style="font-size:0.85rem;color:#6b7280;">2000 CCA</span>
    </div>
    <input type="number" class="cg-input" x-model.number="ccaValue" min="100" max="2000" @input="convert()" style="margin-top:0.5rem;">
  </div>
</div>

<div class="cg-form-group">
  <label class="cg-label">Conversion Ratio</label>
  <input type="range" class="cg-slider" x-model.number="ratio" min="7" max="10" step="0.1" @input="convert()">
  <div style="display:flex;justify-content:space-between;max-width:420px;">
    <span style="font-size:0.85rem;color:#6b7280;">7:1 (reserve/small)</span>
    <span style="font-weight:700;color:var(--cg-purple-dark);" x-text="ratio + ':1'"></span>
    <span style="font-size:0.85rem;color:#6b7280;">10:1 (high-power)</span>
  </div>
</div>

<!-- Result -->
<div class="cg-result" x-show="direction === 'ah2cca'">
  <h4>📊 Ah → CCA Conversion</h4>
  <div class="spec-row"><span class="spec-label">Input</span><span class="spec-value" x-text="ahValue + ' Ah'"></span></div>
  <div class="spec-row"><span class="spec-label">Ratio</span><span class="spec-value" x-text="ratio + ':1'"></span></div>
  <div class="spec-row" style="font-size:1.2rem;border-bottom:2px solid var(--cg-purple);">
    <span class="spec-label">Estimated CCA Range</span>
    <span class="spec-value" x-text="lowCca + ' — ' + highCca + ' CCA'"></span>
  </div>
  <div x-show="direction === 'ah2cca'" style="margin-top:0.5rem;color:#6b7280;font-size:0.9rem;">
    Midpoint: <strong x-text="midCca + ' CCA'"></strong>
  </div>
</div>

<div class="cg-result" x-show="direction === 'cca2ah'" style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-left-color: #22c55e;">
  <h4>📊 CCA → Ah Conversion</h4>
  <div class="spec-row"><span class="spec-label">Input</span><span class="spec-value" x-text="ccaValue + ' CCA'"></span></div>
  <div class="spec-row"><span class="spec-label">Ratio</span><span class="spec-value" x-text="ratio + ':1'"></span></div>
  <div class="spec-row" style="font-size:1.2rem;border-bottom:2px solid #22c55e;">
    <span class="spec-label">Estimated Ah Range</span>
    <span class="spec-value" x-text="lowAh + ' — ' + highAh + ' Ah'"></span>
  </div>
  <div x-show="direction === 'cca2ah'" style="margin-top:0.5rem;color:#6b7280;font-size:0.9rem;">
    Midpoint: <strong x-text="midAh + ' Ah'"></strong>
  </div>
</div>

<!-- Matching models -->
<div x-show="matchingModels.length > 0" style="margin-top:1rem;">
  <strong>🔋 Matching Chengguang Models:</strong>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem;">
    <template x-for="m in matchingModels" :key="m.model">
      <span style="display:inline-block;background:#ede9fe;color:#4c1d95;padding:6px 12px;border-radius:20px;font-weight:600;font-size:0.9rem;" x-text="m.model + ' (' + m.cca + ' CCA, ' + m.ah + 'Ah)'"></span>
    </template>
  </div>
</div>

<div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
  <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
  <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Battery Datasheets</a>
</div>

<div class="cg-warning">
  ⚠️ <strong>Note:</strong> CCA and Ah measure different properties. CCA measures starting power (cold cranking), while Ah measures capacity. The 7:1 to 10:1 ratio is a rough approximation. Always consult the manufacturer datasheet for exact specifications.
</div>

</div>

<script>
function ahCcaConverter() {
  return {
    direction: 'ah2cca',
    ahValue: 60,
    ccaValue: 500,
    ratio: 8.5,
    lowCca: 0, highCca: 0, midCca: 0,
    lowAh: 0, highAh: 0, midAh: 0,
    matchingModels: [],

    batteryModels: [
      { model: 'CG-55B24', cca: 370, ah: 45 },
      { model: 'CG-55D23', cca: 500, ah: 60 },
      { model: 'CG-65D26', cca: 520, ah: 65 },
      { model: 'CG-95E41', cca: 750, ah: 80 },
      { model: 'CG-105D31', cca: 650, ah: 75 },
      { model: 'CG-145G51', cca: 850, ah: 90 },
      { model: 'CG-190H52', cca: 1100, ah: 110 },
      { model: 'CG-56638', cca: 540, ah: 66 },
      { model: 'CG-DIN58043', cca: 580, ah: 74 },
      { model: 'CG-DIN60038', cca: 870, ah: 100 }
    ],

    convert() {
      if (this.direction === 'ah2cca') {
        this.lowCca = Math.round(this.ahValue * 7);
        this.highCca = Math.round(this.ahValue * 10);
        this.midCca = Math.round(this.ahValue * this.ratio);
        // Find models near the midpoint
        this.matchingModels = this.batteryModels
          .filter(m => m.cca >= this.lowCca && m.cca <= this.highCca)
          .sort((a, b) => a.cca - b.cca);
      } else {
        this.lowAh = Math.round(this.ccaValue / 10);
        this.highAh = Math.round(this.ccaValue / 7);
        this.midAh = Math.round(this.ccaValue / this.ratio);
        this.matchingModels = this.batteryModels
          .filter(m => m.ah >= this.lowAh && m.ah <= this.highAh)
          .sort((a, b) => a.ah - b.ah);
      }
    },

    init() {
      this.convert();
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
