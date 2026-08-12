# ⏱️ Battery Runtime Calculator

Estimate how long a battery will power a given load. Based on Amp-hour capacity, battery type, and load wattage.

**Formula:** `Runtime (hours) = (Ah × DoD) ÷ (Watts ÷ 12V)`

---

<div x-data="runtimeCalculator()" class="tool-card">

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

<div class="ecosystem-footer" x-data="ecosystem">
<h4>🌐 Explore the Chengguang Ecosystem</h4>
<div class="ecosystem-links">
  <template x-for="site in sites" :key="site.url">
    <a :href="site.url" class="eco-link" :class="{ active: site.active }" x-text="site.name" target="_blank"></a>
  </template>
</div>
</div>
