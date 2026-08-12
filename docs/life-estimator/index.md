# 📈 Battery Life Estimator

Estimate the remaining life of your battery based on type, age, climate, and driving habits.

---

<div x-data="lifeEstimator()" class="tool-card">

### Battery Information

<div class="cg-form-group">
  <label class="cg-label">Battery Type</label>
  <select class="cg-select" x-model="batteryType">
    <option value="sli">SLI (Conventional Flooded)</option>
    <option value="agm">AGM (Absorbent Glass Mat)</option>
    <option value="efb">EFB (Enhanced Flooded Battery)</option>
    <option value="gel">Gel Cell</option>
  </select>
</div>

<div class="cg-form-group">
  <label class="cg-label">Battery Age (months)</label>
  <input type="range" class="cg-slider" x-model.number="age" min="0" max="84" step="1">
  <div style="display:flex;justify-content:space-between;max-width:420px;font-size:0.85rem;color:#6b7280;">
    <span>New (0)</span><span x-text="age + ' months (' + Math.floor(age/12) + 'y ' + (age%12) + 'm)'"></span><span>7 years (84)</span>
  </div>
</div>

<div class="cg-form-group">
  <label class="cg-label">Climate Zone</label>
  <select class="cg-select" x-model="climate">
    <option value="moderate">🌤️ Moderate (10-25°C / 50-77°F) — Factor: 1.0</option>
    <option value="hot">☀️ Hot (>30°C / 86°F) — Factor: 0.7 (accelerated aging)</option>
    <option value="cold">❄️ Cold (<0°C / 32°F) — Factor: 0.85 (cold stress)</option>
    <option value="extreme">🌡️ Extreme variation — Factor: 0.6 (thermal cycling stress)</option>
  </select>
</div>

<div class="cg-form-group">
  <label class="cg-label">Driving Habit</label>
  <select class="cg-select" x-model="drivingHabit">
    <option value="regular">🚗 Regular (daily 30+ min drives) — Factor: 1.0</option>
    <option value="short">🏙️ Short trips (<15 min, frequent starts) — Factor: 0.75</option>
    <option value="infrequent">📅 Infrequent (weekend only) — Factor: 0.65</option>
    <option value="highway">🛣️ Highway (long drives) — Factor: 1.1</option>
  </select>
</div>

<button class="cg-btn" @click="calculate()" :disabled="!canCalculate">📈 Estimate Remaining Life</button>

<!-- Result -->
<div x-show="result" x-transition class="cg-result" style="display:none;">
  <h4>📊 Life Estimation</h4>
  <div class="spec-row"><span class="spec-label">Battery Type</span><span class="spec-value" x-text="typeLabel"></span></div>
  <div class="spec-row"><span class="spec-label">Age</span><span class="spec-value" x-text="ageLabel"></span></div>
  <div class="spec-row"><span class="spec-label">Climate Factor</span><span class="spec-value" x-text="'×' + climateFactor"></span></div>
  <div class="spec-row"><span class="spec-label">Driving Habit Factor</span><span class="spec-value" x-text="'×' + drivingFactor"></span></div>
  <div class="spec-row"><span class="spec-label">Base Lifespan</span><span class="spec-value" x-text="baseLife + ' months'"></span></div>
  <div class="spec-row" style="font-size:1.1rem;border-bottom:2px solid var(--cg-purple);">
    <span class="spec-label">Adjusted Lifespan</span><span class="spec-value" x-text="adjustedLife + ' months'"></span>
  </div>
  <div class="spec-row" style="font-size:1.3rem;">
    <span class="spec-label">Estimated Remaining Life</span>
    <span class="spec-value" x-text="remainingText" :style="remainingStyle"></span>
  </div>

  <div style="margin-top:1rem;">
    <div style="height:12px;background:#e5e7eb;border-radius:6px;overflow:hidden;max-width:420px;">
      <div :style="{ width: percentUsed + '%', background: barColor, height: '100%', borderRadius: '6px', transition: 'width 0.5s' }"></div>
    </div>
    <div style="display:flex;justify-content:space-between;max-width:420px;font-size:0.8rem;color:#6b7280;margin-top:4px;">
      <span>0% used</span><span x-text="Math.round(percentUsed) + '% used'"></span><span>100% used</span>
    </div>
  </div>

  <div class="cg-warning" x-show="warningMsg" x-text="warningMsg"></div>

  <div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 Find Replacement</a>
    <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Battery Datasheets</a>
  </div>
</div>

</div>

<script>
function lifeEstimator() {
  return {
    batteryType: 'sli',
    age: 24,
    climate: 'moderate',
    drivingHabit: 'regular',
    result: false,
    typeLabel: '', ageLabel: '', climateFactor: 0, drivingFactor: 0,
    baseLife: 0, adjustedLife: 0, remainingMonths: 0,
    remainingText: '', remainingStyle: '', percentUsed: 0, barColor: '#22c55e',
    warningMsg: '',

    get canCalculate() { return true; },

    baseLifespans: { sli: 48, agm: 72, efb: 60, gel: 84 },
    typeLabels: { sli: 'SLI (Conventional Flooded)', agm: 'AGM', efb: 'EFB', gel: 'Gel Cell' },
    climateFactors: { moderate: 1.0, hot: 0.7, cold: 0.85, extreme: 0.6 },
    drivingFactors: { regular: 1.0, short: 0.75, infrequent: 0.65, highway: 1.1 },

    calculate() {
      this.baseLife = this.baseLifespans[this.batteryType] || 48;
      this.climateFactor = this.climateFactors[this.climate] || 1.0;
      this.drivingFactor = this.drivingFactors[this.drivingHabit] || 1.0;

      this.adjustedLife = Math.round(this.baseLife * this.climateFactor * this.drivingFactor);
      this.remainingMonths = this.adjustedLife - this.age;

      this.typeLabel = this.typeLabels[this.batteryType];
      this.ageLabel = `${this.age} months (${Math.floor(this.age/12)} years ${this.age%12} months)`;

      if (this.remainingMonths <= 0) {
        this.remainingText = '⚠️ REPLACE NOW';
        this.remainingStyle = 'color:#ef4444;';
        this.barColor = '#ef4444';
        this.percentUsed = 100;
        this.warningMsg = '🔴 Battery has exceeded its estimated lifespan. Immediate replacement recommended.';
      } else if (this.remainingMonths <= 6) {
        this.remainingText = `⚠️ ~${this.remainingMonths} months — Critical`;
        this.remainingStyle = 'color:#f59e0b;';
        this.barColor = '#f59e0b';
        this.percentUsed = Math.round((this.age / this.adjustedLife) * 100);
        this.warningMsg = '🟡 Battery is near end of life. Plan for replacement soon.';
      } else if (this.remainingMonths <= 12) {
        this.remainingText = `~${this.remainingMonths} months — Fair`;
        this.remainingStyle = 'color:#f59e0b;';
        this.barColor = '#facc15';
        this.percentUsed = Math.round((this.age / this.adjustedLife) * 100);
        this.warningMsg = '';
      } else {
        const years = Math.floor(this.remainingMonths / 12);
        const months = this.remainingMonths % 12;
        this.remainingText = `${years}y ${months}m — Good`;
        this.remainingStyle = 'color:#22c55e;';
        this.barColor = '#22c55e';
        this.percentUsed = Math.round((this.age / this.adjustedLife) * 100);
        this.warningMsg = '';
      }

      this.result = true;
    },

    init() {
      this.calculate();
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
