/**
 * SIAR User & Operator Guide Interactive Controller
 * Simulates local identity generation, vault structure inspection, and anti-forensics panic purge.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. OLED Toggle
  const btnOled = document.getElementById('btnToggleOled');
  if (btnOled) {
    btnOled.addEventListener('click', () => {
      document.body.classList.toggle('oled-mode');
    });
  }

  // 2. Identity Generator Simulator
  const btnGenIdentity = document.getElementById('btnSimGenIdentity');
  const outIdentity = document.getElementById('simIdentityOutput');
  if (btnGenIdentity && outIdentity) {
    btnGenIdentity.addEventListener('click', () => {
      const mockSeeds = [
        "velvet", "timber", "crystal", "matrix", "shield", "beacon", "falcon", "orbit", 
        "echo", "quantum", "hazard", "summit", "drift", "canyon", "siren", "pulse", 
        "anchor", "zenith", "shadow", "aurora", "rebel", "granite", "blaze", "whisper"
      ];
      
      const randomHex = (len) => Array.from({length: len}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const ed25519Pub = "ed25519_pub_" + randomHex(32);
      const x25519Pub = "x25519_dh_" + randomHex(32);
      const sasCode = ["ALPHA", "COBALT", "VECTOR", "SHIELD"][Math.floor(Math.random()*4)] + "-" + Math.floor(1000 + Math.random()*9000);

      outIdentity.innerHTML = `
        <div style="background: rgba(0, 242, 254, 0.05); border: 1px solid rgba(0, 242, 254, 0.2); border-radius: 6px; padding: 14px; margin-top: 8px;">
          <div style="color: var(--siar-cyan-glow); font-weight: 700; margin-bottom: 6px;">✓ NEW SOVEREIGN IDENTITY DERIVED (Hardware Memory):</div>
          <div style="display: grid; gap: 6px;">
            <div><span style="color: var(--siar-text-muted);">Ed25519 Signing PubKey:</span> <code style="color: #ffffff;">${ed25519Pub}</code></div>
            <div><span style="color: var(--siar-text-muted);">X25519 Handshake PubKey:</span> <code style="color: #38bdf8;">${x25519Pub}</code></div>
            <div><span style="color: var(--siar-text-muted);">Short Auth String (SAS):</span> <span style="background: rgba(16,185,129,0.2); color: var(--siar-emerald-online); font-weight:700; padding: 2px 6px; border-radius: 4px;">${sasCode}</span></div>
            <div style="margin-top: 6px;"><span style="color: #fbbf24; font-weight: 600;">24-Word Offline Paper Backup Seed:</span></div>
            <div style="background: #030508; padding: 8px; border-radius: 4px; font-size: 0.75rem; color: #e2e8f0; word-spacing: 4px; border: 1px dashed rgba(255,255,255,0.15);">
              ${mockSeeds.join(' ')}
            </div>
          </div>
        </div>
      `;
    });
  }

  // 3. Vault Backup Structure Inspector Simulator
  const btnInspectVault = document.getElementById('btnSimInspectVault');
  const outVault = document.getElementById('simVaultOutput');
  if (btnInspectVault && outVault) {
    btnInspectVault.addEventListener('click', () => {
      outVault.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 6px; padding: 14px; margin-top: 8px;">
          <div style="color: var(--siar-emerald-online); font-weight: 700; margin-bottom: 8px;">📦 .SIARVAULT CONTAINER STRUCTURE (ChaCha20-Poly1305 Sealed):</div>
          <div style="display: grid; gap: 8px; font-size: 0.78rem;">
            <div style="background: #070a10; padding: 8px; border-radius: 4px; border-left: 3px solid var(--siar-cyan-glow);">
              <strong>[Header]</strong> Magic: <code>SIAR_V1_VAULT</code> | KDF: <code>Argon2id (m=65536, t=4, p=2)</code> | Salt: <code>32-bytes Random</code>
            </div>
            <div style="background: #070a10; padding: 8px; border-radius: 4px; border-left: 3px solid #a78bfa;">
              <strong>[Section 1 - Identity Keys]</strong> Encrypted Ed25519 Root Private Key + X25519 Static Private Key
            </div>
            <div style="background: #070a10; padding: 8px; border-radius: 4px; border-left: 3px solid #34d399;">
              <strong>[Section 2 - OpenMLS Trees]</strong> 14 Active Group Ratchet States + Group Secrets + Epoch Commit Indices
            </div>
            <div style="background: #070a10; padding: 8px; border-radius: 4px; border-left: 3px solid #fbbf24;">
              <strong>[Section 3 - Contact Tickets]</strong> 42 Verified Peer Public Tickets & Proximity Bluetooth / LoRa Addresses
            </div>
            <div style="background: #070a10; padding: 8px; border-radius: 4px; border-left: 3px solid #f43f5e;">
              <strong>[Section 4 - Encrypted Database]</strong> Full SQLite Cipher Database (Messages, Attachments, DTN Bundle Cache)
            </div>
          </div>
        </div>
      `;
    });
  }

  // 4. Panic Purge Anti-Forensics Simulator
  const btnPanicPurge = document.getElementById('btnSimPanicPurge');
  const outPanic = document.getElementById('simPanicOutput');
  if (btnPanicPurge && outPanic) {
    btnPanicPurge.addEventListener('click', () => {
      outPanic.innerHTML = `
        <div style="background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.4); border-radius: 6px; padding: 14px; margin-top: 8px;">
          <div style="color: #f43f5e; font-weight: 700; margin-bottom: 8px;">🚨 EXECUTING ANTI-FORENSIC PANIC PURGE (DoD 5220.22-M):</div>
          <div id="purgeSteps" style="display: grid; gap: 4px; font-size: 0.78rem;">
            <div>[00.00ms] ⚡ Interrupt received: Initiating zero-residual suicide protocol...</div>
          </div>
        </div>
      `;

      const stepsContainer = document.getElementById('purgeSteps');
      const timeline = [
        { t: 200, text: "[12.40ms] 🔒 zeroize::Zeroize applied to device master RAM keys (0x00 overwrites)." },
        { t: 400, text: "[28.15ms] 🗑️ Overwriting SQLite database flash blocks with 7-pass cryptosecure PRNG noise..." },
        { t: 600, text: "[54.30ms] ✂️ Purging all BLE L2CAP, Wi-Fi Direct and LoRa session secrets." },
        { t: 800, text: "[79.10ms] 💥 Syncing OS filesystem dirty pages with sync() & truncating WAL files." },
        { t: 1000, text: "[98.45ms] 💀 ZERO RESIDUAL DATA REMAINING. Process suicide signal SIGKILL invoked." }
      ];

      timeline.forEach(item => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.style.color = item.t === 1000 ? '#f43f5e' : 'var(--siar-text-secondary)';
          if (item.t === 1000) div.style.fontWeight = 'bold';
          div.textContent = item.text;
          stepsContainer.appendChild(div);
        }, item.t);
      });
    });
  }
});
