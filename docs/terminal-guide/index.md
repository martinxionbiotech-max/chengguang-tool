# 🔌 Terminal Type Guide

Interactive decision tree to identify your battery's terminal type. Answer the questions below to narrow down your terminal configuration.

---

<div x-data="terminalGuide()" class="tool-card">

### Terminal Identification Guide

<div class="decision-tree">

<!-- Step 1: Post style -->
<div class="decision-node" :class="{ active: step >= 1 }">
  <h4>Step 1: What do the terminals look like?</h4>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:0.8rem;">
    <button class="cg-btn cg-btn-outline" @click="selectPostType('top')" :style="postType === 'top' ? 'background:var(--cg-purple);color:#fff;' : ''">
      🔝 Round posts on top
    </button>
    <button class="cg-btn cg-btn-outline" @click="selectPostType('side')" :style="postType === 'side' ? 'background:var(--cg-purple);color:#fff;' : ''">
      🔜 Threaded holes on side
    </button>
    <button class="cg-btn cg-btn-outline" @click="selectPostType('stud')" :style="postType === 'stud' ? 'background:var(--cg-purple);color:#fff;' : ''">
      🔩 Threaded studs on top
    </button>
  </div>
</div>

<!-- Step 2: Post size (for top post) -->
<div class="decision-node" :class="{ active: step >= 2 }" x-show="postType === 'top'" x-transition>
  <h4>Step 2: What size are the posts?</h4>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:0.8rem;">
    <button class="cg-btn cg-btn-outline" @click="selectPostSize('standard')" :style="postSize === 'standard' ? 'background:var(--cg-purple);color:#fff;' : ''">
      📏 Standard (19mm Ø positive, 17.5mm Ø negative)
    </button>
    <button class="cg-btn cg-btn-outline" @click="selectPostSize('pencil')" :style="postSize === 'pencil' ? 'background:var(--cg-purple);color:#fff;' : ''">
      ✏️ Pencil-thin (12-13mm Ø, narrow)
    </button>
  </div>
</div>

<!-- Step 3: Post arrangement (for standard top post) -->
<div class="decision-node" :class="{ active: step >= 3 }" x-show="postType === 'top' && postSize === 'standard'" x-transition>
  <h4>Step 3: Post arrangement (view from front of battery)</h4>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:0.8rem;">
    <button class="cg-btn cg-btn-outline" @click="selectPostArrangement('positive-left')" :style="postArrangement === 'positive-left' ? 'background:var(--cg-purple);color:#fff;' : ''">
      ⬅️ Positive (+) on LEFT
    </button>
    <button class="cg-btn cg-btn-outline" @click="selectPostArrangement('positive-right')" :style="postArrangement === 'positive-right' ? 'background:var(--cg-purple);color:#fff;' : ''">
      ➡️ Positive (+) on RIGHT
    </button>
  </div>
</div>

</div>

<!-- Result -->
<div x-show="result" x-transition style="margin-top:1.5rem;">
<div class="cg-result">
  <h4>🔌 Identified Terminal Type: <span x-text="resultName"></span></h4>

  <!-- Terminal SVG Illustration -->
  <div x-html="terminalSvg" style="margin:1rem 0;text-align:center;"></div>

  <div class="spec-row"><span class="spec-label">Type</span><span class="spec-value" x-text="resultName"></span></div>
  <div class="spec-row"><span class="spec-label">Positive Terminal</span><span class="spec-value" x-text="resultPos"></span></div>
  <div class="spec-row"><span class="spec-label">Negative Terminal</span><span class="spec-value" x-text="resultNeg"></span></div>
  <div class="spec-row"><span class="spec-label">Common Applications</span><span class="spec-value" x-text="resultApps"></span></div>
  <div class="spec-row"><span class="spec-label">Chengguang Models</span><span class="spec-value" x-text="resultModels"></span></div>

  <div x-show="resultNote" class="cg-warning" x-text="resultNote"></div>
</div>

<div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
  <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
  <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Battery Datasheets</a>
  <button class="cg-btn cg-btn-outline" @click="reset()">🔄 Start Over</button>
</div>
</div>

</div>

<script>
function terminalGuide() {
  return {
    step: 1,
    postType: '',
    postSize: '',
    postArrangement: '',
    result: false,
    resultName: '', resultPos: '', resultNeg: '', resultApps: '', resultModels: '', resultNote: '',
    terminalSvg: '',

    selectPostType(type) {
      this.postType = type;
      this.postSize = '';
      this.postArrangement = '';
      this.result = false;
      if (type === 'top') {
        this.step = 2;
      } else {
        this.step = 4;
        this.resolve();
      }
    },

    selectPostSize(size) {
      this.postSize = size;
      this.postArrangement = '';
      this.result = false;
      if (size === 'pencil') {
        this.step = 4;
        this.resolve();
      } else {
        this.step = 3;
      }
    },

    selectPostArrangement(arr) {
      this.postArrangement = arr;
      this.step = 4;
      this.resolve();
    },

    resolve() {
      let resultType = '';

      if (this.postType === 'side') {
        resultType = 'side';
      } else if (this.postType === 'stud') {
        resultType = 'stud';
      } else if (this.postType === 'top' && this.postSize === 'pencil') {
        resultType = 'jis-t1';
      } else if (this.postType === 'top' && this.postSize === 'standard' && this.postArrangement === 'positive-left') {
        resultType = 'sae-left';
      } else if (this.postType === 'top' && this.postSize === 'standard' && this.postArrangement === 'positive-right') {
        resultType = 'sae-right';
      }

      const types = {
        'sae-left': {
          name: 'SAE/DIN Post (Positive Left)',
          pos: '19.5mm Ø tapered post (left side)',
          neg: '17.9mm Ø tapered post (right side)',
          apps: 'Most Asian and European vehicles — Toyota, Honda, Nissan, BMW, Mercedes',
          models: 'CG-55D23, CG-65D26, CG-95E41, CG-105D31, CG-145G51, CG-190H52, CG-DIN58043, CG-DIN60038',
          note: 'Most common terminal type worldwide. Standard post clamps required.',
          svg: `<svg width="280" height="180" viewBox="0 0 280 180"><rect x="20" y="30" width="240" height="130" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2"/><rect x="30" y="110" width="220" height="40" rx="6" fill="#d8b4fe" stroke="#7c3aed" stroke-width="1.5"/><text x="140" y="135" text-anchor="middle" fill="#4c1d95" font-size="13" font-weight="600">CHENGGUANG BATTERY</text><circle cx="75" cy="52" r="16" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/><text x="75" y="57" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">+</text><circle cx="205" cy="52" r="14" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><text x="205" y="57" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">−</text><text x="75" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">SAE Post</text><text x="205" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">SAE Post</text></svg>`
        },
        'sae-right': {
          name: 'SAE/DIN Post (Positive Right)',
          pos: '19.5mm Ø tapered post (right side)',
          neg: '17.9mm Ø tapered post (left side)',
          apps: 'Some American vehicles and aftermarket configurations',
          models: 'Custom configuration — verify polarity before purchase',
          note: '⚠️ Reverse polarity configuration. Double-check your vehicle manual before ordering.',
          svg: `<svg width="280" height="180" viewBox="0 0 280 180"><rect x="20" y="30" width="240" height="130" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2"/><rect x="30" y="110" width="220" height="40" rx="6" fill="#d8b4fe" stroke="#7c3aed" stroke-width="1.5"/><text x="140" y="135" text-anchor="middle" fill="#4c1d95" font-size="13" font-weight="600">CHENGGUANG BATTERY</text><circle cx="75" cy="52" r="14" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><text x="75" y="57" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">−</text><circle cx="205" cy="52" r="16" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/><text x="205" y="57" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">+</text><text x="75" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">SAE Post</text><text x="205" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">SAE Post</text></svg>`
        },
        'jis-t1': {
          name: 'JIS T1 (Pencil Post)',
          pos: '12.5mm Ø narrow post (left)',
          neg: '11.0mm Ø narrow post (right)',
          apps: 'Compact Japanese vehicles — Toyota Corolla, Honda Civic, small sedans',
          models: 'CG-55B24',
          note: '⚠️ JIS T1 terminals are thinner than SAE. Standard SAE clamps will NOT fit. Use JIS-specific clamps or adapters.',
          svg: `<svg width="280" height="180" viewBox="0 0 280 180"><rect x="20" y="30" width="240" height="130" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2"/><rect x="30" y="110" width="220" height="40" rx="6" fill="#d8b4fe" stroke="#7c3aed" stroke-width="1.5"/><text x="140" y="135" text-anchor="middle" fill="#4c1d95" font-size="13" font-weight="600">CHENGGUANG BATTERY</text><ellipse cx="75" cy="52" rx="6" ry="18" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/><text x="75" y="57" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">+</text><ellipse cx="205" cy="52" rx="5" ry="15" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/><text x="205" y="57" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">−</text><text x="75" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">JIS T1</text><text x="205" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">JIS T1</text></svg>`
        },
        'side': {
          name: 'Side Terminal (GM-style)',
          pos: '8mm threaded hole, driver side',
          neg: '8mm threaded hole, passenger side',
          apps: 'GM vehicles, some Chevrolet, Cadillac, older American cars',
          models: 'Custom order — contact OEM for side-terminal options',
          note: '⚠️ Side terminal batteries require special bolts (typically 3/8"-16 thread). Not compatible with top-post cables.',
          svg: `<svg width="280" height="180" viewBox="0 0 280 180"><rect x="20" y="30" width="240" height="130" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2"/><rect x="30" y="110" width="220" height="40" rx="6" fill="#d8b4fe" stroke="#7c3aed" stroke-width="1.5"/><text x="140" y="135" text-anchor="middle" fill="#4c1d95" font-size="13" font-weight="600">CHENGGUANG BATTERY</text><circle cx="52" cy="80" r="10" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/><text x="52" y="78" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">+</text><line x1="46" y1="80" x2="36" y2="80" stroke="#ef4444" stroke-width="2"/><circle cx="228" cy="80" r="10" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><text x="228" y="78" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">−</text><line x1="234" y1="80" x2="244" y2="80" stroke="#3b82f6" stroke-width="2"/><text x="52" y="58" text-anchor="middle" fill="#4c1d95" font-size="10">Side</text><text x="228" y="58" text-anchor="middle" fill="#4c1d95" font-size="10">Side</text></svg>`
        },
        'stud': {
          name: 'Stud Terminal (Threaded Stud)',
          pos: 'M6 or M8 threaded stud with nut (left)',
          neg: 'M6 or M8 threaded stud with nut (right)',
          apps: 'Motorcycles, powersports, marine, some European vehicles',
          models: 'Custom order — contact OEM for stud-terminal options',
          note: 'ℹ️ Stud terminals use ring terminals secured by nuts. Common in AGM and powersports batteries.',
          svg: `<svg width="280" height="180" viewBox="0 0 280 180"><rect x="20" y="30" width="240" height="130" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2"/><rect x="30" y="110" width="220" height="40" rx="6" fill="#d8b4fe" stroke="#7c3aed" stroke-width="1.5"/><text x="140" y="135" text-anchor="middle" fill="#4c1d95" font-size="13" font-weight="600">CHENGGUANG BATTERY</text><rect x="63" y="40" width="24" height="24" rx="3" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/><text x="75" y="57" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">+</text><rect x="193" y="40" width="24" height="24" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/><text x="205" y="57" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">−</text><text x="75" y="28" text-anchor="middle" fill="#4c1d95" font-size="10">M8 Stud</text><text x="205" y="28" text-anchor="middle" fill="#4c1d95" font-size="10">M8 Stud</text></svg>`
        }
      };

      const t = types[resultType];
      if (t) {
        this.resultName = t.name;
        this.resultPos = t.pos;
        this.resultNeg = t.neg;
        this.resultApps = t.apps;
        this.resultModels = t.models;
        this.resultNote = t.note;
        this.terminalSvg = t.svg;
        this.result = true;
      }
    },

    reset() {
      this.step = 1;
      this.postType = '';
      this.postSize = '';
      this.postArrangement = '';
      this.result = false;
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
