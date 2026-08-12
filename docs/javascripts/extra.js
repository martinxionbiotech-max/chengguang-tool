// Chengguang Battery Tools — Extra JavaScript
// Alpine.js is loaded via CDN — this file contains shared utilities

document.addEventListener('alpine:init', () => {
  // Shared data for ecosystem footer
  Alpine.data('ecosystem', () => ({
    sites: [
      { name: '🏠 Main Site', url: 'https://chengguangenergy.com' },
      { name: '🔧 Tool Site', url: 'https://tool.chengguangenergy.com', active: true },
      { name: '📊 Data Hub', url: 'https://data.chengguangenergy.com' },
      { name: '📐 Technical', url: 'https://technical.chengguangenergy.com' },
      { name: '🏭 OEM Portal', url: 'https://oem.chengguangenergy.com' },
      { name: '🛒 Market', url: 'https://market.chengguangenergy.com' }
    ]
  }));
});
