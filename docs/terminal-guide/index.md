# 🔌 Terminal Type Guide

Interactive decision tree to identify your battery's terminal type. Answer the questions below to narrow down your terminal configuration.

---

<div x-data="terminalGuide()" class="tool-card" markdown="1">

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

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Battery Terminal Type Guide",
  "url": "https://tool.chengguangenergy.com/terminal-guide/",
  "description": "Interactive guide to identify automotive battery terminal types — SAE/DIN post, JIS T1, side terminal, stud terminal — with illustrations and fitment information.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web",
  "author": {
    "@id": "https://chengguangenergy.com/#organization",
    "@type": "Organization",
    "name": "Chengguang Power Tech Co., Ltd.",
    "url": "https://chengguangenergy.com/"
  }
}
</script>



<div class="ecosystem-footer" x-data="ecosystem">
<h4>🌐 Explore the Chengguang Ecosystem</h4>
<div class="ecosystem-links">
  <template x-for="site in sites" :key="site.url">
    <a :href="site.url" class="eco-link" :class="{ active: site.active }" x-text="site.name" target="_blank"></a>
  </template>
</div>
</div>


---

## :material-help-circle: Frequently Asked Questions

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the different types of car battery terminals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The four main types are: 1) SAE/DIN round post (standard in Europe and Americas), 2) JIS T1 flat tab (standard in Asia — comes in small and large), 3) Side terminal (GM-style, bolt into the side), 4) Stud terminal (threaded post with nut, used in marine and heavy duty)."
      }
    },
    {
      "@type": "Question",
      "name": "How do I know if I have JIS or DIN/SAE terminals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Look at the battery top. JIS terminals are flat metal tabs with a hole (like a ring terminal). SAE/DIN terminals are round lead posts that the cable clamp fits over. If your cable has a clamp that wraps around a post, it's SAE/DIN. If it's a flat connector bolted to a tab, it's JIS."
      }
    },
    {
      "@type": "Question",
      "name": "Can I convert JIS terminals to SAE/DIN?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Terminal adapter posts are available that bolt onto JIS terminals and provide a round SAE/DIN post. These are common in markets where replacement JIS batteries are hard to find. However, also check the hold-down mechanism compatibility."
      }
    },
    {
      "@type": "Question",
      "name": "What size are JIS T1 terminals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JIS T1 terminals come in two sizes: Small T1 (positive terminal ~12.5mm wide, negative ~11mm) and Large T1 (positive ~14.5mm, negative ~13mm). The positive terminal is always slightly larger to prevent reverse connection."
      }
    },
    {
      "@type": "Question",
      "name": "Why do different standards use different terminal types?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Historical and regional preference. Japanese manufacturers standardized on the T1 flat tab for compactness and anti-corrosion benefits. American and European manufacturers continued with the round post design inherited from early automotive electrical systems."
      }
    }
  ]
}

</script>

### What are the different types of car battery terminals?
The four main types are: 1) SAE/DIN round post (standard in Europe and Americas), 2) JIS T1 flat tab (standard in Asia — comes in small and large), 3) Side terminal (GM-style, bolt into the side), 4) Stud terminal (threaded post with nut, used in marine and heavy duty).

### How do I know if I have JIS or DIN/SAE terminals?
Look at the battery top. JIS terminals are flat metal tabs with a hole (like a ring terminal). SAE/DIN terminals are round lead posts that the cable clamp fits over. If your cable has a clamp that wraps around a post, it's SAE/DIN. If it's a flat connector bolted to a tab, it's JIS.

### Can I convert JIS terminals to SAE/DIN?
Yes. Terminal adapter posts are available that bolt onto JIS terminals and provide a round SAE/DIN post. These are common in markets where replacement JIS batteries are hard to find. However, also check the hold-down mechanism compatibility.

### What size are JIS T1 terminals?
JIS T1 terminals come in two sizes: Small T1 (positive terminal ~12.5mm wide, negative ~11mm) and Large T1 (positive ~14.5mm, negative ~13mm). The positive terminal is always slightly larger to prevent reverse connection.

### Why do different standards use different terminal types?
Historical and regional preference. Japanese manufacturers standardized on the T1 flat tab for compactness and anti-corrosion benefits. American and European manufacturers continued with the round post design inherited from early automotive electrical systems.



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
