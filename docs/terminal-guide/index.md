     1|# 🔌 Terminal Type Guide
     2|
     3|Interactive decision tree to identify your battery's terminal type. Answer the questions below to narrow down your terminal configuration.
     4|
     5|---
     6|
     7|<div x-data="terminalGuide()" class="tool-card">
     8|
     9|### Terminal Identification Guide
    10|
    11|<div class="decision-tree">
    12|
    13|<!-- Step 1: Post style -->
    14|<div class="decision-node" :class="{ active: step >= 1 }">
    15|  <h4>Step 1: What do the terminals look like?</h4>
    16|  <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:0.8rem;">
    17|    <button class="cg-btn cg-btn-outline" @click="selectPostType('top')" :style="postType === 'top' ? 'background:var(--cg-purple);color:#fff;' : ''">
    18|      🔝 Round posts on top
    19|    </button>
    20|    <button class="cg-btn cg-btn-outline" @click="selectPostType('side')" :style="postType === 'side' ? 'background:var(--cg-purple);color:#fff;' : ''">
    21|      🔜 Threaded holes on side
    22|    </button>
    23|    <button class="cg-btn cg-btn-outline" @click="selectPostType('stud')" :style="postType === 'stud' ? 'background:var(--cg-purple);color:#fff;' : ''">
    24|      🔩 Threaded studs on top
    25|    </button>
    26|  </div>
    27|</div>
    28|
    29|<!-- Step 2: Post size (for top post) -->
    30|<div class="decision-node" :class="{ active: step >= 2 }" x-show="postType === 'top'" x-transition>
    31|  <h4>Step 2: What size are the posts?</h4>
    32|  <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:0.8rem;">
    33|    <button class="cg-btn cg-btn-outline" @click="selectPostSize('standard')" :style="postSize === 'standard' ? 'background:var(--cg-purple);color:#fff;' : ''">
    34|      📏 Standard (19mm Ø positive, 17.5mm Ø negative)
    35|    </button>
    36|    <button class="cg-btn cg-btn-outline" @click="selectPostSize('pencil')" :style="postSize === 'pencil' ? 'background:var(--cg-purple);color:#fff;' : ''">
    37|      ✏️ Pencil-thin (12-13mm Ø, narrow)
    38|    </button>
    39|  </div>
    40|</div>
    41|
    42|<!-- Step 3: Post arrangement (for standard top post) -->
    43|<div class="decision-node" :class="{ active: step >= 3 }" x-show="postType === 'top' && postSize === 'standard'" x-transition>
    44|  <h4>Step 3: Post arrangement (view from front of battery)</h4>
    45|  <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:0.8rem;">
    46|    <button class="cg-btn cg-btn-outline" @click="selectPostArrangement('positive-left')" :style="postArrangement === 'positive-left' ? 'background:var(--cg-purple);color:#fff;' : ''">
    47|      ⬅️ Positive (+) on LEFT
    48|    </button>
    49|    <button class="cg-btn cg-btn-outline" @click="selectPostArrangement('positive-right')" :style="postArrangement === 'positive-right' ? 'background:var(--cg-purple);color:#fff;' : ''">
    50|      ➡️ Positive (+) on RIGHT
    51|    </button>
    52|  </div>
    53|</div>
    54|
    55|</div>
    56|
    57|<!-- Result -->
    58|<div x-show="result" x-transition style="margin-top:1.5rem;">
    59|<div class="cg-result">
    60|  <h4>🔌 Identified Terminal Type: <span x-text="resultName"></span></h4>
    61|
    62|  <!-- Terminal SVG Illustration -->
    63|  <div x-html="terminalSvg" style="margin:1rem 0;text-align:center;"></div>
    64|
    65|  <div class="spec-row"><span class="spec-label">Type</span><span class="spec-value" x-text="resultName"></span></div>
    66|  <div class="spec-row"><span class="spec-label">Positive Terminal</span><span class="spec-value" x-text="resultPos"></span></div>
    67|  <div class="spec-row"><span class="spec-label">Negative Terminal</span><span class="spec-value" x-text="resultNeg"></span></div>
    68|  <div class="spec-row"><span class="spec-label">Common Applications</span><span class="spec-value" x-text="resultApps"></span></div>
    69|  <div class="spec-row"><span class="spec-label">Chengguang Models</span><span class="spec-value" x-text="resultModels"></span></div>
    70|
    71|  <div x-show="resultNote" class="cg-warning" x-text="resultNote"></div>
    72|</div>
    73|
    74|<div style="margin-top:1rem;display:flex;gap:0.8rem;flex-wrap:wrap;">
    75|  <a href="https://oem.chengguangenergy.com" class="cg-btn" target="_blank">📋 OEM Inquiry</a>
    76|  <a href="https://data.chengguangenergy.com" class="cg-btn cg-btn-outline" target="_blank">📊 Battery Datasheets</a>
    77|  <button class="cg-btn cg-btn-outline" @click="reset()">🔄 Start Over</button>
    78|</div>
    79|</div>
    80|
    81|</div>
    82|
    83|<script>
    84|function terminalGuide() {
    85|  return {
    86|    step: 1,
    87|    postType: '',
    88|    postSize: '',
    89|    postArrangement: '',
    90|    result: false,
    91|    resultName: '', resultPos: '', resultNeg: '', resultApps: '', resultModels: '', resultNote: '',
    92|    terminalSvg: '',
    93|
    94|    selectPostType(type) {
    95|      this.postType = type;
    96|      this.postSize = '';
    97|      this.postArrangement = '';
    98|      this.result = false;
    99|      if (type === 'top') {
   100|        this.step = 2;
   101|      } else {
   102|        this.step = 4;
   103|        this.resolve();
   104|      }
   105|    },
   106|
   107|    selectPostSize(size) {
   108|      this.postSize = size;
   109|      this.postArrangement = '';
   110|      this.result = false;
   111|      if (size === 'pencil') {
   112|        this.step = 4;
   113|        this.resolve();
   114|      } else {
   115|        this.step = 3;
   116|      }
   117|    },
   118|
   119|    selectPostArrangement(arr) {
   120|      this.postArrangement = arr;
   121|      this.step = 4;
   122|      this.resolve();
   123|    },
   124|
   125|    resolve() {
   126|      let resultType = '';
   127|
   128|      if (this.postType === 'side') {
   129|        resultType = 'side';
   130|      } else if (this.postType === 'stud') {
   131|        resultType = 'stud';
   132|      } else if (this.postType === 'top' && this.postSize === 'pencil') {
   133|        resultType = 'jis-t1';
   134|      } else if (this.postType === 'top' && this.postSize === 'standard' && this.postArrangement === 'positive-left') {
   135|        resultType = 'sae-left';
   136|      } else if (this.postType === 'top' && this.postSize === 'standard' && this.postArrangement === 'positive-right') {
   137|        resultType = 'sae-right';
   138|      }
   139|
   140|      const types = {
   141|        'sae-left': {
   142|          name: 'SAE/DIN Post (Positive Left)',
   143|          pos: '19.5mm Ø tapered post (left side)',
   144|          neg: '17.9mm Ø tapered post (right side)',
   145|          apps: 'Most Asian and European vehicles — Toyota, Honda, Nissan, BMW, Mercedes',
   146|          models: 'CG-55D23, CG-65D26, CG-95E41, CG-105D31, CG-145G51, CG-190H52, CG-DIN58043, CG-DIN60038',
   147|          note: 'Most common terminal type worldwide. Standard post clamps required.',
   148|          svg: `<svg width="280" height="180" viewBox="0 0 280 180"><rect x="20" y="30" width="240" height="130" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2"/><rect x="30" y="110" width="220" height="40" rx="6" fill="#d8b4fe" stroke="#7c3aed" stroke-width="1.5"/><text x="140" y="135" text-anchor="middle" fill="#4c1d95" font-size="13" font-weight="600">CHENGGUANG BATTERY</text><circle cx="75" cy="52" r="16" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/><text x="75" y="57" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">+</text><circle cx="205" cy="52" r="14" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><text x="205" y="57" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">−</text><text x="75" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">SAE Post</text><text x="205" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">SAE Post</text></svg>`
   149|        },
   150|        'sae-right': {
   151|          name: 'SAE/DIN Post (Positive Right)',
   152|          pos: '19.5mm Ø tapered post (right side)',
   153|          neg: '17.9mm Ø tapered post (left side)',
   154|          apps: 'Some American vehicles and aftermarket configurations',
   155|          models: 'Custom configuration — verify polarity before purchase',
   156|          note: '⚠️ Reverse polarity configuration. Double-check your vehicle manual before ordering.',
   157|          svg: `<svg width="280" height="180" viewBox="0 0 280 180"><rect x="20" y="30" width="240" height="130" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2"/><rect x="30" y="110" width="220" height="40" rx="6" fill="#d8b4fe" stroke="#7c3aed" stroke-width="1.5"/><text x="140" y="135" text-anchor="middle" fill="#4c1d95" font-size="13" font-weight="600">CHENGGUANG BATTERY</text><circle cx="75" cy="52" r="14" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><text x="75" y="57" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">−</text><circle cx="205" cy="52" r="16" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/><text x="205" y="57" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">+</text><text x="75" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">SAE Post</text><text x="205" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">SAE Post</text></svg>`
   158|        },
   159|        'jis-t1': {
   160|          name: 'JIS T1 (Pencil Post)',
   161|          pos: '12.5mm Ø narrow post (left)',
   162|          neg: '11.0mm Ø narrow post (right)',
   163|          apps: 'Compact Japanese vehicles — Toyota Corolla, Honda Civic, small sedans',
   164|          models: 'CG-55B24',
   165|          note: '⚠️ JIS T1 terminals are thinner than SAE. Standard SAE clamps will NOT fit. Use JIS-specific clamps or adapters.',
   166|          svg: `<svg width="280" height="180" viewBox="0 0 280 180"><rect x="20" y="30" width="240" height="130" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2"/><rect x="30" y="110" width="220" height="40" rx="6" fill="#d8b4fe" stroke="#7c3aed" stroke-width="1.5"/><text x="140" y="135" text-anchor="middle" fill="#4c1d95" font-size="13" font-weight="600">CHENGGUANG BATTERY</text><ellipse cx="75" cy="52" rx="6" ry="18" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/><text x="75" y="57" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">+</text><ellipse cx="205" cy="52" rx="5" ry="15" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/><text x="205" y="57" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">−</text><text x="75" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">JIS T1</text><text x="205" y="28" text-anchor="middle" fill="#4c1d95" font-size="11">JIS T1</text></svg>`
   167|        },
   168|        'side': {
   169|          name: 'Side Terminal (GM-style)',
   170|          pos: '8mm threaded hole, driver side',
   171|          neg: '8mm threaded hole, passenger side',
   172|          apps: 'GM vehicles, some Chevrolet, Cadillac, older American cars',
   173|          models: 'Custom order — contact OEM for side-terminal options',
   174|          note: '⚠️ Side terminal batteries require special bolts (typically 3/8"-16 thread). Not compatible with top-post cables.',
   175|          svg: `<svg width="280" height="180" viewBox="0 0 280 180"><rect x="20" y="30" width="240" height="130" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2"/><rect x="30" y="110" width="220" height="40" rx="6" fill="#d8b4fe" stroke="#7c3aed" stroke-width="1.5"/><text x="140" y="135" text-anchor="middle" fill="#4c1d95" font-size="13" font-weight="600">CHENGGUANG BATTERY</text><circle cx="52" cy="80" r="10" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/><text x="52" y="78" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">+</text><line x1="46" y1="80" x2="36" y2="80" stroke="#ef4444" stroke-width="2"/><circle cx="228" cy="80" r="10" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><text x="228" y="78" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">−</text><line x1="234" y1="80" x2="244" y2="80" stroke="#3b82f6" stroke-width="2"/><text x="52" y="58" text-anchor="middle" fill="#4c1d95" font-size="10">Side</text><text x="228" y="58" text-anchor="middle" fill="#4c1d95" font-size="10">Side</text></svg>`
   176|        },
   177|        'stud': {
   178|          name: 'Stud Terminal (Threaded Stud)',
   179|          pos: 'M6 or M8 threaded stud with nut (left)',
   180|          neg: 'M6 or M8 threaded stud with nut (right)',
   181|          apps: 'Motorcycles, powersports, marine, some European vehicles',
   182|          models: 'Custom order — contact OEM for stud-terminal options',
   183|          note: 'ℹ️ Stud terminals use ring terminals secured by nuts. Common in AGM and powersports batteries.',
   184|          svg: `<svg width="280" height="180" viewBox="0 0 280 180"><rect x="20" y="30" width="240" height="130" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2"/><rect x="30" y="110" width="220" height="40" rx="6" fill="#d8b4fe" stroke="#7c3aed" stroke-width="1.5"/><text x="140" y="135" text-anchor="middle" fill="#4c1d95" font-size="13" font-weight="600">CHENGGUANG BATTERY</text><rect x="63" y="40" width="24" height="24" rx="3" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/><text x="75" y="57" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">+</text><rect x="193" y="40" width="24" height="24" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/><text x="205" y="57" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">−</text><text x="75" y="28" text-anchor="middle" fill="#4c1d95" font-size="10">M8 Stud</text><text x="205" y="28" text-anchor="middle" fill="#4c1d95" font-size="10">M8 Stud</text></svg>`
   185|        }
   186|      };
   187|
   188|      const t = types[resultType];
   189|      if (t) {
   190|        this.resultName = t.name;
   191|        this.resultPos = t.pos;
   192|        this.resultNeg = t.neg;
   193|        this.resultApps = t.apps;
   194|        this.resultModels = t.models;
   195|        this.resultNote = t.note;
   196|        this.terminalSvg = t.svg;
   197|        this.result = true;
   198|      }
   199|    },
   200|
   201|    reset() {
   202|      this.step = 1;
   203|      this.postType = '';
   204|      this.postSize = '';
   205|      this.postArrangement = '';
   206|      this.result = false;
   207|    }
   208|  };
   209|}
   210|</script>
   211|
   212|---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Battery Terminal Type Guide",
  "url": "https://tool.chengguangenergy.com/terminal-guide/",
  "description": "Interactive guide to identify automotive battery terminal types — SAE/DIN post, JIS T1, side terminal, stud terminal — with illustrations and fitment information.",
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


   213|
   214|<div class="ecosystem-footer" x-data="ecosystem">
   215|<h4>🌐 Explore the Chengguang Ecosystem</h4>
   216|<div class="ecosystem-links">
   217|  <template x-for="site in sites" :key="site.url">
   218|    <a :href="site.url" class="eco-link" :class="{ active: site.active }" x-text="site.name" target="_blank"></a>
   219|  </template>
   220|</div>
   221|</div>
   222|

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
