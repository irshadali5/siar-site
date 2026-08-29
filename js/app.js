/**
 * SIAR Official Web Platform Controller & Interactive Modules
 * Architecture: Part 01 - Showcase & Landing UI/UX
 * Domain: siar.irshad.org.in
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas Mesh Engine
  const meshEngine = new MeshSimulationEngine('meshSimulationCanvas');

  // Canvas Action Controls
  const btnSpawnNode = document.getElementById('btnSpawnNode');
  const btnAirGap = document.getElementById('btnAirGap');
  const btnEmergencySos = document.getElementById('btnEmergencySos');

  if (btnSpawnNode) {
    btnSpawnNode.addEventListener('click', () => {
      meshEngine.spawnNode();
    });
  }

  if (btnAirGap) {
    btnAirGap.addEventListener('click', function () {
      const active = meshEngine.toggleAirGap();
      this.classList.toggle('btn-accent', active);
      this.innerHTML = active 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> Air-Gap Active (DTN Bridging)` 
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> Trigger Air Gap`;
    });
  }

  if (btnEmergencySos) {
    btnEmergencySos.addEventListener('click', () => {
      meshEngine.triggerEmergencyBroadcast();
    });
  }

  // 2. Client OS Auto-Detection
  detectClientOS();

  // 3. Tab Switches (Operating Modes, Downloads, Dev Terminal)
  initTabSwitchers();

  // 4. Comparison Matrix Interactive Filter
  initComparisonMatrix();

  // 5. Multi-Transport Failover Interactive Visualizer
  initTransportFailover();

  // 6. In-Browser WASM Cryptographic Laboratory
  initWasmCryptoLab();

  // 7. Clipboard Copy Helper
  initClipboardButtons();

  // 8. Internationalization (i18n) Engine
  initLanguageSelector();

  // 9. Accessibility & OLED Toggles
  initAccessibilityControls();
});

/**
 * Detect client OS and configure dynamic hero download CTA
 */
function detectClientOS() {
  const ua = navigator.userAgent;
  let osName = 'Linux x86_64';
  let badgeIcon = '🐧';
  let targetTab = 'linux';
  let downloadUrl = 'https://pkg.siar.irshad.org.in/deb/pool/main/s/siar-desktop/siar-desktop_0.1.0_amd64.deb';
  let downloadLabel = 'Download Desktop (.deb)';

  if (/Android/i.test(ua)) {
    osName = 'Android (ARM64 / Universal)';
    badgeIcon = '📱';
    targetTab = 'android';
    downloadUrl = 'https://pkg.siar.irshad.org.in/releases/siar-messenger-0.1.0-universal.apk';
    downloadLabel = 'Download Android APK';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    osName = 'macOS Universal (Apple Silicon / Intel)';
    badgeIcon = '🍎';
    targetTab = 'macos';
    downloadUrl = 'https://pkg.siar.irshad.org.in/releases/SIAR_Messenger-0.1.0-universal.dmg';
    downloadLabel = 'Download macOS DMG';
  } else if (/Windows/i.test(ua)) {
    osName = 'Windows x64 / ARM64';
    badgeIcon = '🪟';
    targetTab = 'windows';
    downloadUrl = 'https://pkg.siar.irshad.org.in/releases/SIAR_Messenger-0.1.0-x64.msix';
    downloadLabel = 'Download Windows MSIX';
  }

  const osBadge = document.getElementById('detectedOsName');
  const heroDlBtn = document.getElementById('heroDownloadBtn');

  if (osBadge) {
    osBadge.textContent = `${badgeIcon} ${osName}`;
  }

  if (heroDlBtn) {
    heroDlBtn.href = downloadUrl;
    heroDlBtn.setAttribute('data-target-tab', targetTab);
  }
}

/**
 * Universal Tab Engine for Modes, Downloads, and Terminal
 */
function initTabSwitchers() {
  // Operating Modes
  const modeBtns = document.querySelectorAll('.mode-tab-btn');
  const modePanels = document.querySelectorAll('.mode-content');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      modeBtns.forEach(b => b.classList.remove('active'));
      modePanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPanel = document.getElementById(`mode-${mode}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Downloads Tab Switcher
  const dlBtns = document.querySelectorAll('.dl-tab-btn');
  const dlPanels = document.querySelectorAll('.dl-panel');
  dlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('data-platform');
      dlBtns.forEach(b => b.classList.remove('active'));
      dlPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPanel = document.getElementById(`dl-panel-${platform}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Developer Quickstart Terminal Tabs
  const termTabs = document.querySelectorAll('.term-tab');
  const termBodies = document.querySelectorAll('.term-snippet');
  termTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const snippetId = tab.getAttribute('data-snippet');
      termTabs.forEach(t => t.classList.remove('active'));
      termBodies.forEach(b => b.style.display = 'none');
      tab.classList.add('active');
      const target = document.getElementById(`term-${snippetId}`);
      if (target) target.style.display = 'block';
    });
  });
}

/**
 * Comparison Matrix Category Filter
 */
function initComparisonMatrix() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const rows = document.querySelectorAll('.matrix-row');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      rows.forEach(row => {
        const cat = row.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Multi-Transport Failover Interactive Visualizer
 */
function initTransportFailover() {
  const btnCutInternet = document.getElementById('btnCutInternet');
  const btnJamWifi = document.getElementById('btnJamWifi');
  const btnRestoreNet = document.getElementById('btnRestoreNet');

  const layerQuic = document.getElementById('layerQuic');
  const layerWifi = document.getElementById('layerWifi');
  const layerBle = document.getElementById('layerBle');
  const layerDtn = document.getElementById('layerDtn');
  const logBox = document.getElementById('failoverLogBox');

  let internetDown = false;
  let wifiJammed = false;

  function appendLog(type, text) {
    if (!logBox) return;
    const now = new Date().toISOString().split('T')[1].slice(0, 8);
    const line = document.createElement('div');
    line.className = 'sim-log-line';
    line.innerHTML = `<span class="log-time">[${now}]</span> <span class="log-${type}">${text}</span>`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }

  if (btnCutInternet) {
    btnCutInternet.addEventListener('click', () => {
      internetDown = true;
      if (layerQuic) {
        layerQuic.className = 'transport-layer disabled';
        layerQuic.querySelector('.transport-status-tag').textContent = 'OFFLINE (Zero Central Route)';
        layerQuic.querySelector('.transport-status-tag').style.color = '#f43f5e';
      }
      if (layerWifi) {
        layerWifi.className = 'transport-layer active';
        layerWifi.querySelector('.transport-status-tag').textContent = 'PRIMARY ACTIVE (48 Mbps)';
      }
      appendLog('warn', '🚨 Central Internet / Cellular dropped. Autonomous policy switch: QUIC -> Wi-Fi Direct.');
      appendLog('ok', '✓ Active peer session maintained with 0 lost frames.');
    });
  }

  if (btnJamWifi) {
    btnJamWifi.addEventListener('click', () => {
      wifiJammed = true;
      if (layerWifi) {
        layerWifi.className = 'transport-layer disabled';
        layerWifi.querySelector('.transport-status-tag').textContent = 'RF JAMMED / OUT OF RANGE';
        layerWifi.querySelector('.transport-status-tag').style.color = '#f43f5e';
      }
      if (layerBle) {
        layerBle.className = 'transport-layer active';
        layerBle.querySelector('.transport-status-tag').textContent = 'PRIMARY MESH (BLE 5.4 1.2 Mbps)';
      }
      if (layerDtn) {
        layerDtn.className = 'transport-layer active';
        layerDtn.querySelector('.transport-status-tag').textContent = 'STORE-CARRY-FORWARD ACTIVE';
      }
      appendLog('err', '⚠️ Local 2.4/5GHz Wi-Fi unreachable. Degrading to BLE 5.4 Mesh & DTN Bundle Queue.');
      appendLog('info', '📦 DTN Bundle #8042 stored in local NVMe queue (TTL: 48h).');
    });
  }

  if (btnRestoreNet) {
    btnRestoreNet.addEventListener('click', () => {
      internetDown = false;
      wifiJammed = false;
      if (layerQuic) {
        layerQuic.className = 'transport-layer active';
        layerQuic.querySelector('.transport-status-tag').textContent = 'ACTIVE (QUIC / TLS 1.3)';
        layerQuic.querySelector('.transport-status-tag').style.color = '';
      }
      if (layerWifi) {
        layerWifi.className = 'transport-layer';
        layerWifi.querySelector('.transport-status-tag').textContent = 'STANDBY (Wi-Fi Direct / Aware)';
        layerWifi.querySelector('.transport-status-tag').style.color = '';
      }
      if (layerBle) {
        layerBle.className = 'transport-layer';
        layerBle.querySelector('.transport-status-tag').textContent = 'STANDBY (BLE 5.4)';
      }
      if (layerDtn) {
        layerDtn.className = 'transport-layer';
        layerDtn.querySelector('.transport-status-tag').textContent = 'IDLE (0 Pending Bundles)';
      }
      appendLog('ok', '🔄 Full multi-transport connectivity restored. Flushed 14 DTN bundles to destination.');
    });
  }
}

/**
 * In-Browser Interactive WASM Cryptography Lab Simulator
 */
function initWasmCryptoLab() {
  const btnGenKey = document.getElementById('btnWasmGenKey');
  const btnAdvEpoch = document.getElementById('btnWasmAdvEpoch');
  const btnSerialize = document.getElementById('btnWasmSerialize');

  const pubKeyField = document.getElementById('wasmPubKey');
  const mlsEpochField = document.getElementById('wasmMlsEpoch');
  const hexInspector = document.getElementById('wasmHexInspector');

  let currentEpoch = 1;
  let currentPubKey = 'ed25519:7a4fb918cc3da10ef49b127741d4735e3a265e16eee03f59718b9b5d03019c07';

  if (btnGenKey) {
    btnGenKey.addEventListener('click', () => {
      const randBytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
      currentPubKey = `ed25519:${randBytes}`;
      if (pubKeyField) pubKeyField.textContent = currentPubKey;
      renderHexInspector(currentEpoch, currentPubKey);
    });
  }

  if (btnAdvEpoch) {
    btnAdvEpoch.addEventListener('click', () => {
      currentEpoch++;
      if (mlsEpochField) mlsEpochField.textContent = `Epoch ${currentEpoch} (Ratchet Advance: 0x${(currentEpoch * 17).toString(16)})`;
      renderHexInspector(currentEpoch, currentPubKey);
    });
  }

  if (btnSerialize) {
    btnSerialize.addEventListener('click', () => {
      renderHexInspector(currentEpoch, currentPubKey, true);
    });
  }

  function renderHexInspector(epoch, pubkey, isSerialized = false) {
    if (!hexInspector) return;
    const epochHex = epoch.toString(16).padStart(2, '0');
    const pubPrefix = pubkey.replace('ed25519:', '').slice(0, 16);

    hexInspector.innerHTML = `
<div class="hex-row"><span class="hex-offset">0000:</span> <span class="hex-bytes">53 49 41 52 01 00 03 07</span> <span class="hex-ascii">SIAR....</span></div>
<div class="hex-row"><span class="hex-offset">0008:</span> <span class="hex-bytes">${pubPrefix.match(/../g).join(' ')}</span> <span class="hex-ascii">Identity</span></div>
<div class="hex-row"><span class="hex-offset">0010:</span> <span class="hex-bytes">${epochHex} 04 2a f9 02 10 03 84</span> <span class="hex-ascii">Epoch=${epoch}</span></div>
<div class="hex-row"><span class="hex-offset">0018:</span> <span class="hex-bytes">e9 01 c0 34 1a 88 ff 12</span> <span class="hex-ascii">MLS_Auth</span></div>
<div class="hex-row"><span class="hex-offset">0020:</span> <span class="hex-bytes">bc 90 22 10 01 4b 77 d4</span> <span class="hex-ascii">ChaCha20</span></div>
<div class="hex-row"><span class="hex-offset">0028:</span> <span class="hex-bytes">dd 1f c6 1c 6f 88 4f 48</span> <span class="hex-ascii">Poly1305</span></div>
<div class="hex-row" style="color: #10b981; margin-top: 8px;">
  [✓ Postcard Validated: TransportFrame::DataBundle { epoch: ${epoch}, crypto: MLS_TREE_KEM_X25519 }]
</div>
    `;
  }
}

/**
 * Tactical Clipboard Copy Buttons
 */
function initClipboardButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const origHtml = btn.innerHTML;
          btn.innerHTML = `<span style="color: #10b981; font-family: var(--font-mono); font-size: 0.75rem;">✓ Copied!</span>`;
          setTimeout(() => {
            btn.innerHTML = origHtml;
          }, 2000);
        });
      }
    });
  });
}

/**
 * Internationalization Selector
 */
function initLanguageSelector() {
  const langSelect = document.getElementById('langSelect');
  if (!langSelect || !window.SIAR_I18N) return;

  langSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    const dict = window.SIAR_I18N[lang] || window.SIAR_I18N['en'];

    // Apply RTL for Arabic
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }

    // Replace text elements with i18n keys
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  });
}

/**
 * Accessibility Controls (OLED Mode & High Contrast)
 */
function initAccessibilityControls() {
  const btnOled = document.getElementById('btnToggleOled');
  const btnContrast = document.getElementById('btnToggleContrast');

  if (btnOled) {
    btnOled.addEventListener('click', () => {
      document.body.classList.toggle('oled-mode');
      btnOled.classList.toggle('active');
    });
  }

  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      btnContrast.classList.toggle('active');
    });
  }
}
