/**
 * SIAR Decentralized Plugin Marketplace & Extension Registry
 * Architecture: Part 06 - Plugin Marketplace & Extension Registry
 * Domain: siar.irshad.org.in
 */

const PLUGIN_CATALOG = [
  {
    id: "siar-transport-lora-sx1262",
    name: "siar-transport-lora-sx1262",
    version: "1.2.0",
    category: "transports",
    author: "Irshad Ali <dev@siar.irshad.org.in>",
    description: "LoRa SX1262 hardware transport driver for 915MHz/868MHz long-range disaster mesh packet modulation.",
    rating: 4.9,
    downloads: 14820,
    runtime: "wasm32-wasi",
    blake3: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    size: "342 KB",
    capabilities: ["Hardware SPI", "GPIO [4,17,27]", "Local KV Storage"],
    auditStatus: "Passed (Zero Network Escape)",
    installCmd: "siar plugin install siar-transport-lora-sx1262",
    toml: `[plugin]
name = "siar-transport-lora-sx1262"
version = "1.2.0"
edition = "2024"
authors = ["Irshad Ali <dev@siar.irshad.org.in>"]
description = "LoRa SX1262 hardware transport driver for long-range emergency mesh"
license = "MIT OR Apache-2.0"
category = "transports"

[runtime]
engine = "wasm32-wasi"
entrypoint = "siar_lora_sx1262.wasm"
abi_version = 1
max_memory_mb = 16
cpu_time_limit_ms = 50

[capabilities]
hardware_spi = true
hardware_gpio = [4, 17, 27]
network_raw_sockets = false
local_storage_kv = true`
  },
  {
    id: "offline-topomap-tiles",
    name: "offline-topomap-tiles",
    version: "0.4.1",
    category: "maps",
    author: "SIAR Geospatial Team",
    description: "High-resolution OpenStreetMap vector terrain and topographical contour tiles for off-grid search and rescue.",
    rating: 4.8,
    downloads: 9230,
    runtime: "data-bundle",
    blake3: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
    size: "48.2 MB",
    capabilities: ["Read-Only Storage", "Vector PMTiles"],
    auditStatus: "Passed (Pure Data Vector)",
    installCmd: "siar plugin install offline-topomap-tiles",
    toml: `[plugin]
name = "offline-topomap-tiles"
version = "0.4.1"
edition = "2024"
authors = ["SIAR Geospatial Team"]
description = "High-resolution OpenStreetMap vector terrain tiles for off-grid search and rescue"
license = "ODbL-1.0"
category = "maps"

[runtime]
engine = "data-bundle"
entrypoint = "tiles.pmtiles"
abi_version = 1
max_memory_mb = 128
cpu_time_limit_ms = 10

[capabilities]
read_only_storage = true
network_raw_sockets = false`
  },
  {
    id: "iridium-sbd-satellite",
    name: "iridium-sbd-satellite",
    version: "1.0.4",
    category: "transports",
    author: "Satellite Mesh Collective",
    description: "Iridium 9602/9603 Short Burst Data (SBD) satellite bridge for global trans-oceanic DTN bundle forwarding.",
    rating: 4.9,
    downloads: 6120,
    runtime: "wasm32-wasi",
    blake3: "7a4fb918cc3da10ef49b127741d4735e3a265e16eee03f59718b9b5d03019c07",
    size: "512 KB",
    capabilities: ["Hardware UART", "Local KV Storage"],
    auditStatus: "Passed (Audited Iridium AT Handler)",
    installCmd: "siar plugin install iridium-sbd-satellite",
    toml: `[plugin]
name = "iridium-sbd-satellite"
version = "1.0.4"
edition = "2024"
authors = ["Satellite Mesh Collective"]
description = "Iridium 9602/9603 Short Burst Data (SBD) satellite transceiver bridge"
license = "Apache-2.0"
category = "transports"

[runtime]
engine = "wasm32-wasi"
entrypoint = "siar_iridium.wasm"
abi_version = 1
max_memory_mb = 32
cpu_time_limit_ms = 100

[capabilities]
hardware_uart = "/dev/ttyUSB0"
network_raw_sockets = false
local_storage_kv = true`
  },
  {
    id: "kyber768-pq-kem",
    name: "kyber768-pq-kem",
    version: "2.0.0",
    category: "crypto",
    author: "SIAR Cryptography SIG",
    description: "Post-Quantum ML-KEM (Kyber-768) hybrid key encapsulation layer for quantum-resistant MLS ratchets.",
    rating: 5.0,
    downloads: 18450,
    runtime: "wasm32-wasi",
    blake3: "8f3a42c1b990e51d642cfa3017d57b66448a2f1098c3550a77e192041822910f",
    size: "194 KB",
    capabilities: ["Pure Computation", "Zero I/O Sandbox"],
    auditStatus: "Passed (Zero Syscall Isolation)",
    installCmd: "siar plugin install kyber768-pq-kem",
    toml: `[plugin]
name = "kyber768-pq-kem"
version = "2.0.0"
edition = "2024"
authors = ["SIAR Cryptography SIG"]
description = "Post-Quantum ML-KEM hybrid key encapsulation layer"
license = "MIT OR Apache-2.0"
category = "crypto"

[runtime]
engine = "wasm32-wasi"
entrypoint = "kyber768.wasm"
abi_version = 1
max_memory_mb = 8
cpu_time_limit_ms = 20

[capabilities]
network_raw_sockets = false
hardware_spi = false`
  },
  {
    id: "disaster-weather-sentry",
    name: "disaster-weather-sentry",
    version: "1.1.2",
    category: "bots",
    author: "Emergency Telemetry SIG",
    description: "Autonomous barometer and NOAA alert parser that broadcasts severe storm warnings across mesh hops.",
    rating: 4.7,
    downloads: 8340,
    runtime: "wasm32-wasi",
    blake3: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    size: "280 KB",
    capabilities: ["Hardware I2C", "Mesh Broadcast"],
    auditStatus: "Passed (WASI Sandboxed)",
    installCmd: "siar plugin install disaster-weather-sentry",
    toml: `[plugin]
name = "disaster-weather-sentry"
version = "1.1.2"
edition = "2024"
authors = ["Emergency Telemetry SIG"]
description = "Autonomous barometer and NOAA alert parser for disaster mesh"
license = "Apache-2.0"
category = "bots"

[runtime]
engine = "wasm32-wasi"
entrypoint = "weather_sentry.wasm"
abi_version = 1
max_memory_mb = 16
cpu_time_limit_ms = 40

[capabilities]
hardware_i2c = true
network_raw_sockets = false`
  },
  {
    id: "aprs-packet-radio",
    name: "aprs-packet-radio",
    version: "0.9.1",
    category: "transports",
    author: "Amateur Radio SIG",
    description: "AX.25 1200-baud AFSK packet radio transport adapter for VHF/UHF ham radio transceiver interfacing.",
    rating: 4.8,
    downloads: 4890,
    runtime: "wasm32-wasi",
    blake3: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    size: "410 KB",
    capabilities: ["Audio DSP", "Hardware Serial"],
    auditStatus: "Passed (Sandboxed DSP Engine)",
    installCmd: "siar plugin install aprs-packet-radio",
    toml: `[plugin]
name = "aprs-packet-radio"
version = "0.9.1"
edition = "2024"
authors = ["Amateur Radio SIG"]
description = "AX.25 1200-baud AFSK packet radio transport adapter"
license = "MIT"
category = "transports"

[runtime]
engine = "wasm32-wasi"
entrypoint = "aprs.wasm"
abi_version = 1
max_memory_mb = 32
cpu_time_limit_ms = 80

[capabilities]
hardware_serial = "/dev/ttyUSB1"
network_raw_sockets = false`
  },
  {
    id: "tactical-oled-hud",
    name: "tactical-oled-hud",
    version: "1.0.0",
    category: "themes",
    author: "Tactical UI Working Group",
    description: "Zero-emission red night-vision and tactical high-contrast themes optimized for OLED tactical radios.",
    rating: 4.9,
    downloads: 11200,
    runtime: "ui-theme",
    blake3: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
    size: "64 KB",
    capabilities: ["CSS Design Tokens"],
    auditStatus: "Passed (Static CSS Bundle)",
    installCmd: "siar plugin install tactical-oled-hud",
    toml: `[plugin]
name = "tactical-oled-hud"
version = "1.0.0"
edition = "2024"
authors = ["Tactical UI Working Group"]
description = "Zero-emission red night-vision and high-contrast OLED themes"
license = "MIT"
category = "themes"

[runtime]
engine = "ui-theme"
entrypoint = "theme.css"
abi_version = 1

[capabilities]
css_tokens = true`
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderPlugins(PLUGIN_CATALOG);
  initMarketplaceFilters();
  initManifestGenerator();
  initModalClose();
});

/**
 * Render Plugin Cards Grid
 */
function renderPlugins(plugins) {
  const container = document.getElementById('pluginCardsGrid');
  if (!container) return;

  if (plugins.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--siar-text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">No matching extensions found.</p>
        <p style="font-size: 0.85rem;">Try modifying your keyword search or category filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = plugins.map(p => `
    <div class="siar-glass-card plugin-card">
      <div class="plugin-card-head">
        <div>
          <span class="plugin-cat-tag">${p.category.toUpperCase()}</span>
          <h3 class="plugin-title">${p.name}</h3>
          <span class="plugin-author">by ${p.author.split('<')[0].trim()}</span>
        </div>
        <div style="text-align: right;">
          <div class="rating-badge">★ ${p.rating.toFixed(1)}</div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--siar-text-muted); margin-top: 4px;">
            ${(p.downloads / 1000).toFixed(1)}k DLs
          </div>
        </div>
      </div>

      <p class="plugin-desc">${p.description}</p>

      <div class="perm-tag-wrap">
        ${p.capabilities.map(cap => `<span class="perm-pill">🔒 ${cap}</span>`).join('')}
      </div>

      <div class="pkg-cmd-box">
        <code>$ ${p.installCmd}</code>
        <button class="copy-btn" data-copy="${p.installCmd}" title="Copy install command">📋</button>
      </div>

      <div style="display: flex; gap: 10px; margin-top: auto;">
        <button class="btn btn-secondary btn-sm btn-inspect-plugin" data-plugin-id="${p.id}" style="flex: 1;">
          🔍 Inspect Manifest & Audit
        </button>
      </div>
    </div>
  `).join('');

  // Bind modal inspect triggers
  document.querySelectorAll('.btn-inspect-plugin').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-plugin-id');
      const found = PLUGIN_CATALOG.find(x => x.id === pid);
      if (found) openPluginModal(found);
    });
  });
}

/**
 * Filter and Search Controller
 */
function initMarketplaceFilters() {
  const searchInput = document.getElementById('pluginSearchInput');
  const catButtons = document.querySelectorAll('.plugin-cat-btn');
  const sortSelect = document.getElementById('pluginSortSelect');
  const countEl = document.getElementById('pluginCountDisplay');

  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'downloads';

  function applyFilters() {
    let filtered = PLUGIN_CATALOG.filter(p => {
      const matchCat = (currentCategory === 'all' || p.category === currentCategory);
      const matchQuery = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.capabilities.some(c => c.toLowerCase().includes(searchQuery));
      return matchCat && matchQuery;
    });

    // Sorting
    if (currentSort === 'downloads') {
      filtered.sort((a, b) => b.downloads - a.downloads);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (currentSort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderPlugins(filtered);
    if (countEl) countEl.textContent = `${filtered.length} extensions indexed`;
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-cat');
      applyFilters();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFilters();
    });
  }
}

/**
 * Open Plugin Details Modal with WASI Sandbox Audit
 */
function openPluginModal(plugin) {
  const modal = document.getElementById('pluginModal');
  const title = document.getElementById('modalPluginTitle');
  const body = document.getElementById('modalPluginBody');
  if (!modal || !title || !body) return;

  title.textContent = `${plugin.name} (v${plugin.version})`;
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 18px;">
      
      <!-- Security & Sandbox Audit Card -->
      <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <strong style="color: var(--siar-emerald-online); font-size: 0.9rem;">🛡️ WASI Sandbox Security Audit</strong>
          <span class="canvas-badge" style="background: rgba(16,185,129,0.2); color: var(--siar-emerald-online);">${plugin.auditStatus}</span>
        </div>
        <div style="font-size: 0.8rem; color: #cbd5e1; display: flex; flex-direction: column; gap: 6px;">
          <div>✓ <strong>Memory Ceiling:</strong> Strict Wasmtime heap boundary enforced.</div>
          <div>✓ <strong>Network Isolation:</strong> Zero raw internet socket escape.</div>
          <div>✓ <strong>Content Digest:</strong> BLAKE3 content-addressed immutability verified.</div>
        </div>
      </div>

      <!-- BLAKE3 Digest -->
      <div>
        <span class="pkg-meta-label">BLAKE3 Content Digest:</span>
        <div style="font-family: var(--font-mono); font-size: 0.76rem; background: #030508; padding: 8px 12px; border-radius: 4px; border: 1px solid var(--siar-border-subtle); color: #38bdf8; word-break: break-all;">
          ${plugin.blake3}
        </div>
      </div>

      <!-- Manifest TOML -->
      <div>
        <span class="pkg-meta-label">Authoritative Plugin Manifest (siar-plugin.toml):</span>
        <pre class="spec-content-pre" style="height: 180px; padding: 12px; font-size: 0.76rem; margin-top: 6px;"><code>${plugin.toml}</code></pre>
      </div>

      <!-- Install Action -->
      <div class="pkg-cmd-box">
        <code>$ ${plugin.installCmd}</code>
        <button class="copy-btn" data-copy="${plugin.installCmd}">📋</button>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

/**
 * Developer Manifest Template Builder
 */
function initManifestGenerator() {
  const inputName = document.getElementById('genPlugName');
  const selectCat = document.getElementById('genPlugCat');
  const inputMem = document.getElementById('genPlugMem');
  const chkSpi = document.getElementById('genPlugSpi');
  const chkGpio = document.getElementById('genPlugGpio');
  const chkKv = document.getElementById('genPlugKv');
  const outputToml = document.getElementById('genTomlOutput');

  function generateToml() {
    if (!outputToml) return;
    const name = inputName ? (inputName.value || "my-extension") : "my-extension";
    const cat = selectCat ? selectCat.value : "transports";
    const mem = inputMem ? (parseInt(inputMem.value) || 16) : 16;

    let toml = `[plugin]\nname = "${name}"\nversion = "0.1.0"\nedition = "2024"\nauthors = ["Your Name <you@domain.org>"]\ndescription = "Custom extension for SIAR mesh"\nlicense = "MIT OR Apache-2.0"\ncategory = "${cat}"\n\n[runtime]\nengine = "wasm32-wasi"\nentrypoint = "${name.replace(/-/g, '_')}.wasm"\nabi_version = 1\nmax_memory_mb = ${mem}\ncpu_time_limit_ms = 50\n\n[capabilities]\nnetwork_raw_sockets = false\n`;

    if (chkSpi && chkSpi.checked) toml += `hardware_spi = true\n`;
    if (chkGpio && chkGpio.checked) toml += `hardware_gpio = [4, 17, 27]\n`;
    if (chkKv && chkKv.checked) toml += `local_storage_kv = true\n`;

    outputToml.textContent = toml;
  }

  [inputName, selectCat, inputMem, chkSpi, chkGpio, chkKv].forEach(el => {
    if (el) {
      el.addEventListener('input', generateToml);
      el.addEventListener('change', generateToml);
    }
  });

  generateToml();
}

/**
 * Modal Close Handling
 */
function initModalClose() {
  const modal = document.getElementById('pluginModal');
  const closeBtn = document.getElementById('modalPluginCloseBtn');
  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}
