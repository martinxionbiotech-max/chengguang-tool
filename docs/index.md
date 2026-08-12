# 🔋 Chengguang Battery Tools

Welcome to the interactive battery toolkit for **Chengguang Energy**. Select a tool below to find the right battery, calculate CCA, cross-reference models, and more.

---

## Available Tools

<div class="tool-card" markdown="1">

### 🔍 Battery Finder
Find the correct Chengguang battery for your vehicle. Step-by-step: Make → Model → Engine → Region.

[Launch Battery Finder →](finder/index.md)

</div>

<div class="tool-card" markdown="1">

### ❄️ CCA Calculator
Calculate recommended Cold Cranking Amps based on engine displacement, fuel type, and temperature range.

[Launch CCA Calculator →](cca-calculator/index.md)

</div>

<div class="tool-card" markdown="1">

### 🔄 JIS ↔ DIN Cross-Reference
Cross-reference between JIS and DIN battery standards with dimension comparisons and fit warnings.

[Launch Cross-Reference →](cross-reference/index.md)

</div>

<div class="tool-card" markdown="1">

### ⏱️ Runtime Calculator
Estimate how long a battery will last under a given load based on Ah, battery type, and wattage.

[Launch Runtime Calculator →](runtime-calculator/index.md)

</div>

<div class="tool-card" markdown="1">

### 📈 Life Estimator
Estimate remaining battery life based on type, age, climate, and driving habits.

[Launch Life Estimator →](life-estimator/index.md)

</div>

<div class="tool-card" markdown="1">

### 🔁 Ah ↔ CCA Converter
Convert between Amp-hours (Ah) and Cold Cranking Amps (CCA) with a bidirectional slider.

[Launch Ah↔CCA Converter →](ah-cca-converter/index.md)

</div>

<div class="tool-card" markdown="1">

### 🔌 Terminal Type Guide
Interactive decision tree to identify battery terminal types — SAE, JIS T1, side terminal, stud terminal.

[Launch Terminal Guide →](terminal-guide/index.md)

</div>

---

## Chengguang Ecosystem

<div class="ecosystem-footer" x-data="ecosystem">
<h4>🌐 Explore the Chengguang Ecosystem</h4>
<div class="ecosystem-links">
  <template x-for="site in sites" :key="site.url">
    <a :href="site.url" class="eco-link" :class="{ active: site.active }" x-text="site.name" target="_blank"></a>
  </template>
</div>
<p style="font-size:0.85rem;color:#6b7280;">Corporate · Data · Technical · OEM · Marketplace</p>
</div>
