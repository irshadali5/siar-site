/**
 * SIAR Tactical Deep-Dive & Architecture Showcase Interactive Controller
 * Domain: siar.irshadlab.org
 * Subsystems: 7-Layer Blueprint, 5-Stage Packet Lifecycle, Capability Bitmask,
 *             Tactical Mesh Estimator, and Postcard Wire Inspector.
 */

document.addEventListener('DOMContentLoaded', () => {
  initArchitectureLayerInspector();
  initLifecycleStepper();
  initCapabilityBitmaskSimulator();
  initTacticalEstimator();
  initWireProtocolInspector();
});

/* ==============================================================================
   1. 7-Layer Architecture Blueprint Inspector
   ============================================================================== */
const SIAR_ARCH_LAYERS = {
  7: {
    title: "Tactical Application & UI Layer",
    crates: ["apps/desktop", "apps/android", "apps/cli", "apps/emergency-node", "crates/siar-ui-state"],
    tag: "L7 • Presentation & User Space",
    desc: "Provides reactive cross-platform user experiences compiled in Rust with zero Google Play or Apple Services runtime dependencies. Seamlessly bridges Dioxus desktop webviews, Android native Jetpack Compose surfaces, and zero-overhead CLI/embedded daemons.",
    specs: "Spec 21 (Testing), Spec 25 (Android Media), Spec 27 (Android Packaging)",
    threadSafety: "Send + Sync / Async Tokio Actors / MVVM Unidirectional Bus",
    memoryFootprint: "Desktop: ~24MB RSS | Android: ~18MB RSS | Headless Node: ~4.2MB",
    rfcCompliance: "Zero Cloud Push Notification Relays / Local-First Reactive UI",
    docLink: "sys-arch/01-protocol-extension-system-architecture.html"
  },
  6: {
    title: "Realtime Media & Streaming Audio/Video Engine",
    crates: ["crates/siar-calls", "crates/siar-media-av1", "crates/siar-media-audio"],
    tag: "L6 • Low-Latency DSP & Codecs",
    desc: "Realtime peer-to-peer audio and video transmission optimized for low-bandwidth and high-packet-loss environments. Features custom pure-Rust Opus DSP (AEC, noise suppression, AGC) and zero-copy AV1 hardware surface pipelines on mobile.",
    specs: "Spec 25 (Android Surface Zero-Copy), Spec 26 (Audio DSP), Spec 29 (Calls)",
    threadSafety: "Lock-Free Ring Buffers / SIMD Accelerated / Realtime Audio Priority",
    memoryFootprint: "Dynamic Jitter Buffer: < 4MB | AV1 Decoder Ring: Zero-Copy HW",
    rfcCompliance: "RFC 7587 (Opus RTP), RFC 7741 (RTP AV1), RFC 3550 (RTP/RTCP)",
    docLink: "sys-arch/29-realtime-calls-media-session-protocol-architecture.html"
  },
  5: {
    title: "Identity, MLS Cryptography & Trust Chain",
    crates: ["crates/siar-identity-multidevice", "crates/siar-crypto", "crates/siar-crypto-mls"],
    tag: "L5 • Sovereign Trust & Forward Secrecy",
    desc: "Enforces a five-tier decentralized trust model. Root identity keys (Ed25519) remain cold; ephemeral device certificates operate under strictly monotonic generation ratchets to reject rollback attacks. Implements OpenMLS (RFC 9420) tree ratchets for Post-Compromise Security (PCS).",
    specs: "Spec 02 (Multi-Device Identity), Spec 28 (Production E2EE & Key Mgmt)",
    threadSafety: "Strict Invariant: Zero Private Key Export Across Boundaries",
    memoryFootprint: "TreeKEM Group State (100 members): ~64KB | Keyring: ~12KB",
    rfcCompliance: "RFC 9420 (MLS), RFC 8032 (Ed25519), RFC 7748 (X25519)",
    docLink: "sys-arch/02-multi-device-identity-architecture.html"
  },
  4: {
    title: "Storage, Event Log & Transactional Outbox Engine",
    crates: ["crates/siar-storage", "crates/siar-blob", "crates/siar-dtn"],
    tag: "L4 • Persist-Before-Send Invariant",
    desc: "guarantees zero data loss across power outages. Every message, state mutation, and media chunk is committed to an embedded transactional write-ahead log (WAL) before radio transmission is attempted. Large media files are split into BLAKE3 content-addressed verified blobs.",
    specs: "Spec 04 (Offline Event Log), Spec 05 (Robust File/Blob Subsystem)",
    threadSafety: "ACID Transactional WAL / Zero-Copy Memory-Mapped Chunk Views",
    memoryFootprint: "SQLite WAL Cache: 8MB (Configurable) | BLAKE3 Tree: ~32 bytes/chunk",
    rfcCompliance: "BLAKE3 Tree Hashing Specification / B-Tree Transaction Log",
    docLink: "sys-arch/04-offline-event-log-architecture.html"
  },
  3: {
    title: "Autonomous Multipath Routing & Policy Engine",
    crates: ["crates/siar-routing", "crates/siar-protocol", "crates/siar-connectivity"],
    tag: "L3 • Dynamic Bearer Selection & Backpressure",
    desc: "Continually evaluates physical link health (latency, jitter, SNR, battery consumption, MTU). Dynamically steers packet flows across available bearers, balancing load over local Wi-Fi Direct, BLE mesh, or QUIC tunnels with strict anti-sybil proof-of-work limits.",
    specs: "Spec 03 (Transport Routing Policy), Spec 08 (Resource Limits & Backpressure)",
    threadSafety: "Asynchronous Weighted Fair Queuing (WFQ) / Token Bucket Leaky Shaper",
    memoryFootprint: "Routing Table (1000 nodes): ~380KB | Policy Matrix: ~16KB",
    rfcCompliance: "Dynamic Cost Metric Routing / IETF Leaky Bucket Traffic Shaping",
    docLink: "sys-arch/03-transport-routing-policy-engine-architecture.html"
  },
  2: {
    title: "Delay-Tolerant Store-Carry-Forward (DTN) Subsystem",
    crates: ["crates/siar-dtn", "crates/siar-protocol-ext"],
    tag: "L2 • Air-Gap Blackout Survival",
    desc: "Bridges physical geographical partitions. When peers are out of radio contact, messages are packed into encrypted bundles and stored in transit nodes (pedestrians, vehicles, drones, solar repeaters). Custody transfer handshakes ensure bundles are safely carried across air gaps.",
    specs: "Spec 06 (DTN Store-Carry-Forward), Spec 17 (Emergency Priority Classes)",
    threadSafety: "Content-Addressed Custody Acks / Multi-Criteria Expiration Pruning",
    memoryFootprint: "Bundle Header Index: ~48 bytes/bundle | Storage Cap: Up to 512GB NVMe",
    rfcCompliance: "RFC 9171 (Bundle Protocol Version 7), RFC 9172 (BPSec Security)",
    docLink: "sys-arch/06-dtn-store-carry-forward-architecture.html"
  },
  1: {
    title: "Heterogeneous Pluggable Transports",
    crates: ["crates/siar-transport", "crates/siar-transport-ble", "crates/siar-transport-wifi"],
    tag: "L1 • Physical Radio Abstraction",
    desc: "Abstracts physical wireless hardware into uniform async stream and datagram channels. Supports Iroh QUIC/UDP across IP networks, Wi-Fi Direct and Wi-Fi Aware (NAN) for high-speed local ad-hoc links, and BLE 5.4 coded PHY for ultra-low-power long-distance mesh beacons.",
    specs: "Spec 12 (Multipath Networking), Spec 14 (Proximity Abstraction)",
    threadSafety: "Native Platform HCI / Linux Netlink / Android Platform FFI Binding",
    memoryFootprint: "Transport Buffers: ~1.2MB | BLE Mesh Radio Daemon: ~800KB",
    rfcCompliance: "RFC 9000 (QUIC), Bluetooth SIG Core 5.4, Wi-Fi Alliance Wi-Fi Aware",
    docLink: "sys-arch/12-multipath-networking-architecture.html"
  }
};

function initArchitectureLayerInspector() {
  const cards = document.querySelectorAll('.arch-layer-card');
  const tagEl = document.getElementById('inspectorTag');
  const titleEl = document.getElementById('inspectorTitle');
  const descEl = document.getElementById('inspectorDesc');
  const cratesEl = document.getElementById('inspectorCrates');
  const specsEl = document.getElementById('inspectorSpecs');
  const safetyEl = document.getElementById('inspectorSafety');
  const memEl = document.getElementById('inspectorMem');
  const rfcEl = document.getElementById('inspectorRfc');
  const docLinkEl = document.getElementById('inspectorDocLink');

  if (!cards.length || !titleEl) return;

  function setLayer(layerNum) {
    const data = SIAR_ARCH_LAYERS[layerNum];
    if (!data) return;

    cards.forEach(c => {
      const active = c.getAttribute('data-layer') === String(layerNum);
      c.classList.toggle('active', active);
    });

    tagEl.textContent = data.tag;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    specsEl.textContent = data.specs;
    safetyEl.textContent = data.threadSafety;
    memEl.textContent = data.memoryFootprint;
    rfcEl.textContent = data.rfcCompliance;
    if (docLinkEl) docLinkEl.href = data.docLink;

    cratesEl.innerHTML = '';
    data.crates.forEach(crate => {
      const span = document.createElement('span');
      span.className = 'crate-pill';
      span.textContent = crate;
      cratesEl.appendChild(span);
    });
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const num = parseInt(card.getAttribute('data-layer'), 10);
      setLayer(num);
    });
  });

  // Default to Layer 4 (Storage & Outbox) for initial presentation
  setLayer(4);
}

/* ==============================================================================
   2. 5-Stage Packet Lifecycle Visual Stepper & Auto-Play
   ============================================================================== */
const LIFECYCLE_STAGES = [
  {
    step: 1,
    title: "Step 1: Local Transactional Commitment (Persist-Before-Send)",
    desc: "Before any radio wave is transmitted, Alice's device signs the message payload with its ephemeral Ed25519 device key, encrypts it within the active OpenMLS tree ratchet (Epoch 4), and commits the transaction to an embedded SQLite Write-Ahead Log. If battery dies right now, zero data is lost.",
    activeNodes: ["node-sender"],
    pulseActive: false,
    log: [
      "[00:00:00.102] tx_begin: session_id=0x9f18a24c",
      "[00:00:00.108] ed25519_sign: device_key_thumbprint=7a4f... valid=true",
      "[00:00:00.114] mls_epoch_ratchet: advance epoch=4 -> 5 secret_hash=0x83e1",
      "[00:00:00.126] wal_commit: written to /var/lib/siar/outbox.db (status=UNSENT)"
    ]
  },
  {
    step: 2,
    title: "Step 2: Dynamic Bearer Probing & Multi-Radio Multiplexing",
    desc: "The autonomous routing engine checks the internet gateway (Iroh/QUIC). No WAN uplink detected (blackout scenario). The policy engine instantly prioritizes Wi-Fi Direct (500 Mbps, 80m) and BLE 5.4 advertisement frames (2 Mbps, 25m) with zero user intervention.",
    activeNodes: ["node-sender", "node-mesh1"],
    pulseActive: true,
    log: [
      "[00:00:00.201] route_probe: WAN gateway 1.1.1.1 unreachable (timeout 50ms)",
      "[00:00:00.210] bearer_fallback: transitioning from QUIC_WAN -> ADHOC_RADIO",
      "[00:00:00.222] ble_scan: discovered 4 candidate neighbors on BLE 5.4 HCI0",
      "[00:00:00.235] p2p_handshake: authenticated neighbor 0x3a8f over Wi-Fi Aware"
    ]
  },
  {
    step: 3,
    title: "Step 3: Ad-Hoc Neighborhood Mesh Traversal",
    desc: "The packet is transmitted over local radio waves to Peer A. Each hop performs a BLAKE3 keyed-MAC verification to reject malformed or spoofed packets without revealing the inner encrypted payload. Ephemeral hop counters prevent routing loops.",
    activeNodes: ["node-mesh1", "node-mesh2"],
    pulseActive: true,
    log: [
      "[00:00:00.312] hop_tx: sending Postcard frame (148 bytes) to peer 0x3a8f",
      "[00:00:00.320] blake3_mac: hop-by-hop integrity verified (mac_ok=true)",
      "[00:00:00.334] hop_forward: peer 0x3a8f forwards to solar repeater 0x7b12",
      "[00:00:00.345] edge_detected: repeater 0x7b12 reports no live radio links to Target Zone"
    ]
  },
  {
    step: 4,
    title: "Step 4: Physical Air-Gap Bridging (DTN Store-Carry-Forward)",
    desc: "With a 15-kilometer physical air gap separating the sectors, the solar repeater encapsulates the packet into an RFC 9171 Bundle. A passing patrol vehicle (or walking courier) absorbs the bundle into its encrypted DTN cache and physically transports it across the air gap.",
    activeNodes: ["node-mesh2", "node-carrier"],
    pulseActive: true,
    log: [
      "[00:00:01.002] dtn_bundle_pack: serialized RFC 9171 bundle (ttl=72h, prio=URGENT)",
      "[00:00:01.018] dtn_custody_transfer: transferred bundle to Patrol Mule Vehicle 0x09c4",
      "[00:00:01.034] vehicle_in_transit: moving across physical dead-zone (speed=45 km/h)",
      "[00:00:01.050] dtn_store: 240GB NVMe storage status: 84 bundles in transit custody"
    ]
  },
  {
    step: 5,
    title: "Step 5: Autonomous Re-assembly, Ratchet Advance & Delivery",
    desc: "The vehicle arrives in Sector B. Bob's phone discovers the vehicle over BLE 5.4. Mutual DTN custody handshake delivers the bundle. Bob's local MLS state advances the ratchet, decrypts the message, and marks delivery in local SQLite storage. Mission accomplished.",
    activeNodes: ["node-carrier", "node-receiver"],
    pulseActive: false,
    log: [
      "[00:00:02.105] beacon_rx: detected destination identity (Bob: 0x9b5d) via BLE 5.4",
      "[00:00:02.118] dtn_custody_release: bundle delivered, custody ack emitted",
      "[00:00:02.132] mls_decrypt: epoch 5 ratchet key derived, ChaCha20-Poly1305 OK",
      "[00:00:02.148] message_delivered: UI notification emitted: 'Patrol Team 2 arrived.'"
    ]
  }
];

function initLifecycleStepper() {
  const stepBtns = document.querySelectorAll('.lifecycle-step-btn');
  const stageTitle = document.getElementById('lifecycleTitle');
  const stageDesc = document.getElementById('lifecycleDesc');
  const consoleBox = document.getElementById('lifecycleConsole');
  const btnAutoPlay = document.getElementById('btnLifecycleAutoPlay');
  const connector = document.getElementById('flowConnector');

  if (!stepBtns.length || !stageTitle) return;

  let currentStep = 1;
  let autoPlayTimer = null;

  function renderStep(stepIndex) {
    const stage = LIFECYCLE_STAGES[stepIndex - 1];
    if (!stage) return;
    currentStep = stepIndex;

    stepBtns.forEach(btn => {
      const active = parseInt(btn.getAttribute('data-step'), 10) === stepIndex;
      btn.classList.toggle('active', active);
    });

    stageTitle.textContent = stage.title;
    stageDesc.textContent = stage.desc;

    // Update node highlights
    document.querySelectorAll('.flow-node-box').forEach(node => {
      const id = node.id;
      node.classList.toggle('highlight', stage.activeNodes.includes(id));
    });

    // Connector pulse
    if (connector) {
      connector.classList.toggle('active-pulse', stage.pulseActive);
    }

    // Terminal log
    if (consoleBox) {
      consoleBox.innerHTML = '';
      stage.log.forEach(line => {
        const div = document.createElement('div');
        div.className = 'sim-log-line';
        div.innerHTML = `<span style="color: #64748b;">${line.slice(0, 14)}</span> <span style="color: #38bdf8;">${line.slice(14)}</span>`;
        consoleBox.appendChild(div);
      });
      consoleBox.scrollTop = consoleBox.scrollHeight;
    }
  }

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        if (btnAutoPlay) btnAutoPlay.textContent = '▶ Auto-Play';
      }
      const s = parseInt(btn.getAttribute('data-step'), 10);
      renderStep(s);
    });
  });

  if (btnAutoPlay) {
    btnAutoPlay.addEventListener('click', () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        btnAutoPlay.textContent = '▶ Auto-Play';
      } else {
        btnAutoPlay.textContent = '⏸ Pause';
        autoPlayTimer = setInterval(() => {
          let next = currentStep + 1;
          if (next > LIFECYCLE_STAGES.length) next = 1;
          renderStep(next);
        }, 3200);
      }
    });
  }

  renderStep(1);
}

/* ==============================================================================
   3. Multi-Device Capability Bitmask Simulator
   ============================================================================== */
const CAPABILITY_MASKS = {
  CAN_SEND_MESSAGES: 1 << 0,       // 0x0001
  CAN_RECEIVE_MESSAGES: 1 << 1,    // 0x0002
  CAN_AUDIO_VIDEO_CALLS: 1 << 2,   // 0x0004
  CAN_RELAY_DTN_BLIND: 1 << 3,     // 0x0008
  CAN_PAIR_NEW_DEVICES: 1 << 4,    // 0x0010
  CAN_ROTATE_KEYS: 1 << 5          // 0x0020
};

function initCapabilityBitmaskSimulator() {
  const checkboxes = document.querySelectorAll('.bitmask-opt');
  const hexOut = document.getElementById('bitmaskHexOutput');
  const roleOut = document.getElementById('bitmaskRoleAssessment');
  const certJson = document.getElementById('bitmaskCertJson');

  if (!checkboxes.length || !hexOut) return;

  function updateBitmask() {
    let mask = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) {
        const val = cb.getAttribute('data-cap');
        if (CAPABILITY_MASKS[val]) {
          mask |= CAPABILITY_MASKS[val];
        }
      }
    });

    const hexStr = '0x' + mask.toString(16).toUpperCase().padStart(8, '0');
    hexOut.textContent = hexStr;

    // Assess role profile
    let role = "Custom Constrained Device";
    if (mask === 0x3F) {
      role = "⭐ Sovereign Master Device (Full Administrative & Crypto Authority)";
    } else if (mask === (1 << 3)) {
      role = "🛡️ Blind DTN Mule / Solar Repeater (Zero Read Access, High Security)";
    } else if ((mask & (1 << 4)) === 0 && (mask & (1 << 5)) === 0) {
      role = "📱 Operational Field Client (Cannot Pair Devices or Revoke Keys)";
    }

    if (roleOut) roleOut.textContent = role;

    if (certJson) {
      const mockCert = {
        generation: 4,
        device_thumbprint: "ed25519:3a8f190c4b72...",
        capability_bitmask: hexStr,
        signed_by: "account_root:7a4fb918cc...",
        revocation_status: "ACTIVE",
        monotonic_counter: 1409
      };
      certJson.textContent = JSON.stringify(mockCert, null, 2);
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateBitmask);
  });

  updateBitmask();
}

/* ==============================================================================
   4. Tactical Mesh Range & DTN Transit Calculator
   ============================================================================== */
const RADIO_SPECS = {
  ble: { speedKbps: 125, rangeMeters: 35, powerMw: 15, name: "BLE 5.4 Mesh" },
  wifi: { speedKbps: 250000, rangeMeters: 80, powerMw: 450, name: "Wi-Fi Direct / NAN" },
  lora: { speedKbps: 1.2, rangeMeters: 4500, powerMw: 85, name: "LoRa Mesh" },
  dtn_vehicle: { speedKbps: 500000, rangeMeters: 50000, powerMw: 50, name: "DTN Patrol Vehicle" }
};

const PAYLOAD_SIZES = {
  sos: 120,          // bytes
  text: 2048,        // bytes
  voice: 36864,      // bytes (36 KB)
  photo: 2500000,    // bytes (2.5 MB)
  video: 35000000    // bytes (35 MB)
};

function initTacticalEstimator() {
  const selRadio = document.getElementById('calcRadio');
  const selPayload = document.getElementById('calcPayload');
  const selHops = document.getElementById('calcHops');

  const outLatency = document.getElementById('calcOutLatency');
  const outEnergy = document.getElementById('calcOutEnergy');
  const outBattery = document.getElementById('calcOutBattery');
  const outRetention = document.getElementById('calcOutRetention');

  if (!selRadio || !selPayload || !selHops || !outLatency) return;

  function calculate() {
    const radioKey = selRadio.value;
    const payloadKey = selPayload.value;
    const hops = parseInt(selHops.value, 10);

    const radio = RADIO_SPECS[radioKey] || RADIO_SPECS['wifi'];
    const bytes = PAYLOAD_SIZES[payloadKey] || PAYLOAD_SIZES['text'];

    // Over-the-air raw transmission time per hop in seconds
    const bits = bytes * 8;
    const speedBps = radio.speedKbps * 1000;
    let timePerHopSec = bits / speedBps;

    // Minimum radio link handshake latency
    const handshakeLatencySec = radioKey === 'lora' ? 0.8 : (radioKey === 'ble' ? 0.08 : 0.02);
    timePerHopSec += handshakeLatencySec;

    let totalLatencySec = timePerHopSec * hops;

    // If vehicle courier, add physical transit
    if (radioKey === 'dtn_vehicle') {
      totalLatencySec = 1800 + (bits / speedBps); // ~30 minutes courier drive
    }

    // Format Latency
    let latencyStr = '';
    if (totalLatencySec < 1) {
      latencyStr = `${Math.round(totalLatencySec * 1000)} ms`;
    } else if (totalLatencySec < 60) {
      latencyStr = `${totalLatencySec.toFixed(2)} sec`;
    } else if (totalLatencySec < 3600) {
      latencyStr = `${(totalLatencySec / 60).toFixed(1)} min`;
    } else {
      latencyStr = `${(totalLatencySec / 3600).toFixed(1)} hours`;
    }

    // Energy calculation: Power (W) * Time (s) = Joules
    const powerWatts = radio.powerMw / 1000;
    const totalEnergyJoules = powerWatts * timePerHopSec * Math.min(hops, 2); // local node only spends tx energy on its hop
    const energyMwh = (totalEnergyJoules / 3600) * 1000;

    // Typical phone battery: 4000mAh @ 3.8V = 15.2 Wh = 15200 mWh
    const batteryPercent = (energyMwh / 15200) * 100;

    outLatency.textContent = latencyStr;
    outEnergy.textContent = `${totalEnergyJoules < 0.01 ? '<0.01' : totalEnergyJoules.toFixed(2)} Joules (${energyMwh.toFixed(3)} mWh)`;
    outBattery.textContent = batteryPercent < 0.0001 ? "< 0.0001%" : `${batteryPercent.toFixed(4)}%`;

    // DTN Retention estimation on 64GB node
    const maxBundles = Math.floor((64 * 1024 * 1024 * 1024) / (bytes + 256));
    const retentionDays = Math.min(Math.round(maxBundles / 500), 365); // assuming 500 msgs/day
    outRetention.textContent = `${maxBundles.toLocaleString()} bundles (~${retentionDays} days)`;
  }

  selRadio.addEventListener('change', calculate);
  selPayload.addEventListener('change', calculate);
  selHops.addEventListener('input', calculate);

  calculate();
}

/* ==============================================================================
   5. Wire Protocol Binary Frame Decoder
   ============================================================================== */
const WIRE_FRAMES = {
  chat: {
    type: "TransportFrame::DataEnvelope",
    hex: [
      { offset: "0000", bytes: "53 49 41 52", label: "field-magic", name: "Magic 'SIAR'" },
      { offset: "0004", bytes: "01 02", label: "field-flags", name: "v1.0 + Priority Class 2" },
      { offset: "0006", bytes: "7a 4f b9 18 cc 3d a1 0e 91 00 ff 44", label: "field-sender", name: "Sender Ephemeral PubKey" },
      { offset: "0012", bytes: "00 00 00 00 00 00 00 05", label: "field-epoch", name: "MLS Epoch Counter 5" },
      { offset: "001a", bytes: "a4 1f b8 99 22 10 7c 3b 12 90 ee 01 44 88 ff 1a", label: "field-auth", name: "ChaCha20-Poly1305 Auth Tag" },
      { offset: "002a", bytes: "e1 02 c8 99 fa b1 47 ... [112 Bytes]", label: "field-payload", name: "Ciphertext Envelope (Postcard)" }
    ],
    schema: {
      protocol_version: 1,
      priority_class: "URGENT (2)",
      sender_thumbprint: "ed25519:7a4fb918cc...",
      mls_epoch: 5,
      hop_ttl: 7,
      inner_encryption: "ChaCha20-Poly1305-IETF",
      integrity_mac: "BLAKE3-Keyed-256",
      payload_size: "112 bytes"
    }
  },
  mls_commit: {
    type: "TransportFrame::MlsRatchetCommit",
    hex: [
      { offset: "0000", bytes: "53 49 41 52", label: "field-magic", name: "Magic 'SIAR'" },
      { offset: "0004", bytes: "01 00", label: "field-flags", name: "v1.0 + Control Frame" },
      { offset: "0006", bytes: "3a 8f 01 cc 44 99 12 00 81 22 77 bb", label: "field-sender", name: "Committer Device PubKey" },
      { offset: "0012", bytes: "00 00 00 00 00 00 00 06", label: "field-epoch", name: "Target Epoch 6 Ratchet" },
      { offset: "001a", bytes: "55 88 12 44 99 aa bb cc dd ee ff 00 11 22 33 44", label: "field-auth", name: "TreeKEM Confirmation Tag" },
      { offset: "002a", bytes: "04 1a ff ... [Direct Path TreeKEM 1.2 KB]", label: "field-payload", name: "Tree Ratchet Path Secrets" }
    ],
    schema: {
      protocol_version: 1,
      priority_class: "CONTROL (0)",
      sender_thumbprint: "ed25519:3a8f01cc44...",
      mls_epoch: 6,
      commit_type: "MemberAddWithDirectPath",
      tree_kem_algorithm: "MLS_128_DHKEMX25519_CHACHA20POLY1305_SHA256_Ed25519",
      payload_size: "1240 bytes"
    }
  },
  dtn_bundle: {
    type: "TransportFrame::DtnBundleV7",
    hex: [
      { offset: "0000", bytes: "53 49 41 52", label: "field-magic", name: "Magic 'SIAR'" },
      { offset: "0004", bytes: "01 03", label: "field-flags", name: "v1.0 + RFC 9171 DTN Bundle" },
      { offset: "0006", bytes: "09 c4 bb 12 77 88 99 00 11 44 ee 99", label: "field-sender", name: "Custody Node EID" },
      { offset: "0012", bytes: "00 00 00 00 04 a1 20 00", label: "field-epoch", name: "Geological Expiry (72h TTL)" },
      { offset: "001a", bytes: "77 12 99 01 44 bb cc aa 00 ff 88 22 11 55 ee dd", label: "field-auth", name: "BPSec Block Authentication" },
      { offset: "002a", bytes: "19 ff 22 ... [Encrypted Bundle Payload]", label: "field-payload", name: "Multi-Hop Bundle Data" }
    ],
    schema: {
      protocol_version: 1,
      priority_class: "DTN_EXPEDITE (3)",
      destination_eid: "dtn://shelter-beta/outbox",
      custodian_eid: "dtn://mule-patrol-04",
      lifetime_seconds: 259200,
      bpsec_cipher_suite: "BIB-HMAC256 + BCB-AES-GCM",
      payload_size: "4096 bytes"
    }
  }
};

function initWireProtocolInspector() {
  const selFrame = document.getElementById('wireFrameSelector');
  const hexContainer = document.getElementById('wireHexContainer');
  const schemaContainer = document.getElementById('wireSchemaContainer');

  if (!selFrame || !hexContainer || !schemaContainer) return;

  function renderFrame(frameKey) {
    const data = WIRE_FRAMES[frameKey] || WIRE_FRAMES['chat'];

    hexContainer.innerHTML = '';
    data.hex.forEach(row => {
      const div = document.createElement('div');
      div.className = 'hex-row';
      div.innerHTML = `<span class="hex-offset">${row.offset}:</span> <span class="hex-bytes">${row.bytes}</span> <span class="wire-field-badge ${row.label}">${row.name}</span>`;
      hexContainer.appendChild(div);
    });

    schemaContainer.innerHTML = `<pre style="margin: 0; color: #10b981;"><code>${JSON.stringify(data.schema, null, 2)}</code></pre>`;
  }

  selFrame.addEventListener('change', (e) => {
    renderFrame(e.target.value);
  });

  renderFrame('chat');
}
