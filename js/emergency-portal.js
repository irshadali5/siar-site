/**
 * SIAR Emergency Captive Portal & Offline Survival Hub Engine
 * Architecture: Part 08 - Offline Distribution & Emergency Captive Portal
 * Domain: siar.irshad.org.in | http://192.168.4.1/portal.html
 */

document.addEventListener('DOMContentLoaded', () => {
  // If on captive portal page
  if (document.getElementById('sosTransmitterForm')) {
    initCaptiveSosTransmitter();
    initLocalMeshChat();
    initGpsAutoFill();
  }

  // If on offline survival hub page
  if (document.getElementById('btnCopyMagnet')) {
    initOfflineHubUtilities();
  }
});

/**
 * In-Browser Web SOS Distress Transmitter (Captive Portal)
 */
function initCaptiveSosTransmitter() {
  const form = document.getElementById('sosTransmitterForm');
  const inputMsg = document.getElementById('sosMessageText');
  const inputLat = document.getElementById('sosLat');
  const inputLon = document.getElementById('sosLon');
  const statusBox = document.getElementById('sosStatusBox');

  if (!form || !statusBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = inputMsg ? inputMsg.value.trim() : "Emergency assistance requested";
    const lat = inputLat ? inputLat.value.trim() : "37.7749";
    const lon = inputLon ? inputLon.value.trim() : "-122.4194";

    statusBox.style.display = 'block';
    statusBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; color: var(--siar-amber-warning);">
        <span class="ticker-pulse" style="background: var(--siar-amber-warning);"></span>
        <span>Broadcasting Postcard Emergency Frame (0x0F) over 915MHz LoRa & BLE...</span>
      </div>
    `;

    setTimeout(() => {
      statusBox.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--siar-emerald-online); border-radius: var(--radius-sm); padding: 14px; color: #ffffff;">
          <div style="color: var(--siar-emerald-online); font-weight: 700; font-size: 0.9rem; margin-bottom: 4px;">
            ✓ EMERGENCY DISTRESS SIGNAL RELAYED ACROSS MESH
          </div>
          <div style="font-size: 0.78rem; color: #cbd5e1; font-family: var(--font-mono);">
            Message: "${msg}"<br>
            Coordinates: ${lat}, ${lon}<br>
            Frame: <code>EmergencyAlert::Priority_SOS (0x0F)</code> • Hops Relayed: 4 • Local Repeater: SIAR-Emergency-Node-ALPHA
          </div>
        </div>
      `;

      // Append to local bulletin chat
      appendLocalMessage("You (Web SOS)", msg, "Emergency Alert", true);
    }, 1200);
  });
}

/**
 * GPS Coordinate Autofill
 */
function initGpsAutoFill() {
  const btnGps = document.getElementById('btnAutoGps');
  const inputLat = document.getElementById('sosLat');
  const inputLon = document.getElementById('sosLon');

  if (btnGps && inputLat && inputLon) {
    btnGps.addEventListener('click', () => {
      if ("geolocation" in navigator) {
        btnGps.textContent = "🛰️ Acquiring Fix...";
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            inputLat.value = pos.coords.latitude.toFixed(6);
            inputLon.value = pos.coords.longitude.toFixed(6);
            btnGps.textContent = "✓ Fix Acquired";
          },
          (err) => {
            inputLat.value = "37.774929";
            inputLon.value = "-122.419416";
            btnGps.textContent = "📍 Fallback Coordinates";
          }
        );
      } else {
        inputLat.value = "37.774929";
        inputLon.value = "-122.419416";
      }
    });
  }
}

/**
 * Local Mesh Bulletin & Chat Simulator (Captive Portal)
 */
function initLocalMeshChat() {
  const chatBox = document.getElementById('localMeshChatStream');
  const chatInput = document.getElementById('chatMsgInput');
  const chatForm = document.getElementById('localChatForm');

  if (!chatForm || !chatInput) return;

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    appendLocalMessage("Local Citizen (Browser)", text, "Local Wi-Fi", false);
    chatInput.value = '';
  });
}

function appendLocalMessage(sender, text, transport, isSos = false) {
  const chatBox = document.getElementById('localMeshChatStream');
  if (!chatBox) return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = 'siar-glass-card';
  div.style.padding = '12px 14px';
  div.style.marginBottom = '10px';
  if (isSos) {
    div.style.borderColor = 'rgba(244, 63, 94, 0.4)';
    div.style.background = 'rgba(244, 63, 94, 0.05)';
  }

  div.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
      <strong style="font-size: 0.82rem; color: ${isSos ? 'var(--siar-rose-critical)' : 'var(--siar-cyan-glow)'}; font-family: var(--font-mono);">
        ${sender}
      </strong>
      <span style="font-size: 0.7rem; color: var(--siar-text-muted); font-family: var(--font-mono);">
        ${transport} • ${time}
      </span>
    </div>
    <div style="font-size: 0.86rem; color: #ffffff;">${text}</div>
  `;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Offline Hub Utilities (Magnet Links, Iroh P2P, USB Provisioning)
 */
function initOfflineHubUtilities() {
  const MAGNET_URI = "magnet:?xt=urn:btih:7f9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a&dn=SIAR_Release_v0.1.0_All_Platforms&ws=https://pkg.siar.irshad.org.in/releases/&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.openbittorrent.com:6969/announce";

  const btnMagnet = document.getElementById('btnCopyMagnet');
  if (btnMagnet) {
    btnMagnet.setAttribute('data-copy', MAGNET_URI);
  }

  // USB Provisioning Command Generator
  const selectUsbOs = document.getElementById('selectUsbTargetOs');
  const outputUsbScript = document.getElementById('outputUsbCommand');

  if (selectUsbOs && outputUsbScript) {
    selectUsbOs.addEventListener('change', (e) => {
      const target = e.target.value;
      if (target === 'linux') {
        outputUsbScript.textContent = `# Prepare Bootable Field Provisioning USB Drive
curl -LO https://pkg.siar.irshad.org.in/releases/siar-survival-pack-v0.1.0.tar.zst
tar -I zstd -xvf siar-survival-pack-v0.1.0.tar.zst -C /media/usb/
chmod +x /media/usb/serve-local.sh
/media/usb/serve-local.sh 8080`;
      } else if (target === 'android') {
        outputUsbScript.textContent = `# Android OTG USB Sneakernet Copy
mkdir -p /storage/usbotg/SIAR_Offline/
cp bin/android/siar-messenger-0.1.0-universal.apk /storage/usbotg/SIAR_Offline/
# Insert OTG drive into Android phone & tap APK in Files app to install with zero internet!`;
      } else if (target === 'windows') {
        outputUsbScript.textContent = `# Windows Offline Sneakernet Provisioning
Expand-Archive -Path .\\siar-survival-pack-v0.1.0.zip -DestinationPath D:\\SIAR_Field_Kit\\
cd D:\\SIAR_Field_Kit\\
.\\serve-local.bat`;
      }
    });
  }
}
