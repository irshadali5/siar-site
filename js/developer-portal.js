/**
 * SIAR Developer Portal & Protocol Specification Interactive Showcase Engine
 * Architecture: Parts I through XVI
 * Domain: siar.irshad.org.in | docs.siar.irshad.org.in
 */

const SDK_SNIPPETS = {
  rust: `// Cargo.toml: siar = "0.1.0", tokio = { version = "1", features = ["full"] }
use siar::prelude::*;

#[tokio::main]
async fn main() -> Result<(), SiarError> {
    // 1. Initialize Node with local storage and auto-discovered transports
    let config = SiarConfig::builder()
        .storage_dir("~/.local/share/siar")
        .enable_ble_mesh(true)
        .enable_wifi_direct(true)
        .dtn_storage_quota_mb(500)
        .build();

    let node = SiarNode::init(config).await?;
    println!("Node Sovereign Address: {}", node.public_identity().address());

    // 2. Stream incoming decrypted mesh messages
    let mut receiver = node.subscribe_messages().await?;
    tokio::spawn(async move {
        while let Some(msg) = receiver.recv().await {
            println!("Received payload: {} from {}", msg.text(), msg.sender_id);
        }
    });

    // 3. Dispatch an end-to-end encrypted bundle
    let dest_key = PublicKey::from_hex("9b1288ff12bc902210014b77d4dd1fc61c6f884f48641d02b4d121d3fd328cb0")?;
    node.send_message(&dest_key, b"Emergency medical dispatch for Sector 4", Priority::EmergencySos).await?;

    Ok(())
}`,

  kotlin: `// build.gradle.kts: implementation("org.siar:siar-android:0.1.0")
import org.siar.android.SiarEngine
import org.siar.android.SiarConfig
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    private lateinit var siar: SiarEngine

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Initialize SIAR Engine with background BLE & Wi-Fi Direct
        siar = SiarEngine.create(
            context = applicationContext,
            config = SiarConfig.Builder()
                .enableBleMesh(true)
                .enableWifiDirect(true)
                .setDtnStorageQuotaMb(500)
                .build()
        )

        // 2. Collect Real-Time Decentralized Messages
        lifecycleScope.launch {
            siar.incomingMessages.collect { message ->
                Log.i("SIAR", "Received: \${message.payloadUtf8} via \${message.transport}")
            }
        }

        // 3. Send Message
        lifecycleScope.launch {
            siar.sendMessage(
                destinationHex = "9b1288ff12bc9022...",
                content = "Emergency coordinates: 37.7749, -122.4194"
            )
        }
    }
}`,

  cpp: `// CMakeLists.txt: find_package(SiarCore REQUIRED)
#include <iostream>
#include <vector>
#include "siar_core.h"

int main() {
    SiarConfig config = {
        .storage_path = "/var/lib/siar",
        .dtn_storage_quota_mb = 1000,
        .enable_ble_mesh = true,
        .enable_wifi_direct = true,
        .enable_quic_fallback = true,
        .local_listen_port = 9443
    };

    SiarNodeHandle* handle = nullptr;
    if (siar_node_init(&config, &handle) != 0) {
        std::cerr << "Failed to initialize SIAR node" << std::endl;
        return 1;
    }

    uint8_t pubkey[32];
    siar_node_get_identity(handle, pubkey);
    std::cout << "SIAR C-ABI Node Initialized. Identity Key: ";
    for (int i = 0; i < 32; ++i) printf("%02x", pubkey[i]);
    printf("\\n");

    // Clean shutdown
    siar_node_destroy(handle);
    return 0;
}`,

  python: `# Python 3.10+ Unix Domain Socket IPC Client
import socket
import json

def query_siar_daemon(method: str, params: dict = None) -> dict:
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as client:
        client.connect("/var/run/siar/siar-node.sock")
        payload = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params or {},
            "id": 1
        }
        client.sendall(json.dumps(payload).encode('utf-8') + b'\\n')
        response = client.recv(8192)
        return json.loads(response.decode('utf-8'))

# Query live node telemetry
status = query_siar_daemon("siar_get_node_info")
print(f"Node Address:          {status['result']['node_id']}")
print(f"Active Mesh Neighbors: {status['result']['active_neighbors']}")
print(f"DTN Queued Bundles:   {status['result']['dtn_queue_bundles']}")`,

  typescript: `// npm install @siar/client
import { SiarClient } from '@siar/client';

async function run() {
  const client = new SiarClient({
    endpoint: 'ws://127.0.0.1:9443',
    authToken: process.env.SIAR_RPC_TOKEN
  });

  await client.connect();
  console.log('Connected to local SIAR daemon:', client.nodeIdentity);

  // Subscribe to live telemetry
  client.on('peer_discovered', (peer) => {
    console.log(\`New mesh peer: \${peer.nodeId} via \${peer.transport}\`);
  });

  // Dispatch message
  await client.sendMessage({
    recipient: '9b1288ff12bc...',
    payload: 'Sensor telemetry: Solar Voltage 14.2V'
  });
}

run().catch(console.error);`,

  swift: `// Package.swift: .package(url: "https://github.com/irshadali5/siar-swift", from: "0.1.0")
import SwiftUI
import SiarKit

@main
struct SiarEmergencyApp: App {
    @StateObject private var meshEngine = SiarMeshEngine(
        storageDirectory: FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0],
        enableCoreBluetooth: true,
        enableMultipeerConnectivity: true
    )

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(meshEngine)
                .task {
                    // Start BLE background mesh discovery
                    try? await meshEngine.start()
                }
        }
    }
}`,

  go: `package main

import (
	"context"
	"fmt"
	"log"
	"github.com/irshadali5/siar-go/siar"
)

func main() {
	client, err := siar.NewClient("/var/run/siar/siar-node.sock")
	if err != nil {
		log.Fatalf("Failed to connect to SIAR daemon: %v", err)
	}
	defer client.Close()

	metrics, err := client.GetMetrics(context.Background())
	if err != nil {
		log.Fatalf("Error fetching metrics: %v", err)
	}

	fmt.Printf("SIAR Node Online: %d peers, %d DTN bundles\\n", 
		metrics.ActivePeers, metrics.DtnBundles)
}`
};

document.addEventListener('DOMContentLoaded', () => {
  initDocSearch();
  initCodeSnippetSwitcher();
  initWireFrameBuilder();
  initRpcTester();
  initPeerTicketStudio();
  initEtxCalculator();
  initPowMinerPlayground();
  initPrometheusLiveViewer();
  initDocScrollspy();
});

/**
 * Fast Full-Text Documentation Search
 */
function initDocSearch() {
  const input = document.getElementById('docSearchInput');
  const resultsBox = document.getElementById('docSearchResults');
  if (!input || !resultsBox) return;

  const DOC_INDEX = [
    { title: "Postcard Binary Wire Framing", hash: "#wire-spec", desc: "Byte offsets, magic bytes, envelope flags and wire serialization." },
    { title: "Pure-Rust Crates Architecture", hash: "#rust-crates", desc: "siar-crypto, siar-transport, siar-dtn, and siar-security." },
    { title: "C-ABI Foreign Function Interface", hash: "#c-abi", desc: "include/siar_core.h C header reference, memory models, and lifecycles." },
    { title: "Android Kotlin Jetpack Compose SDK", hash: "#android-sdk", desc: "Native Android BLE 5.4 & Wi-Fi Direct background service integration." },
    { title: "Headless Node Daemon JSON-RPC", hash: "#rpc-spec", desc: "Unix Domain Socket IPC & JSON-RPC 2.0 schema explorer." },
    { title: "Cryptographic Identity & OpenMLS Studio", hash: "#identity-mls", desc: "Interactive Ed25519 identity generator, Tree-KEM ratchet, and QR Peer Tickets." },
    { title: "Multi-Transport Link & ETX Engine", hash: "#multi-transport", desc: "BLE 5.x, Wi-Fi Direct, LoRa SX1262 framing and ETSI airtime budgets." },
    { title: "Anti-Sybil Proof-of-Work Playground", hash: "#anti-sybil", desc: "Dynamic BLAKE3 Proof-of-Work challenge solver and difficulty dials." },
    { title: "Zero-PII Prometheus Telemetry", hash: "#telemetry-metrics", desc: "Prometheus /metrics exposition format and alert rule engine." },
    { title: "Cryptographic Test Vectors Suite", hash: "#test-vectors", desc: "Downloadable test vectors for Ed25519, OpenMLS, DTN, PoW, and ETX." }
  ];

  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      resultsBox.style.display = 'none';
      return;
    }

    const matches = DOC_INDEX.filter(item => 
      item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );

    if (matches.length > 0) {
      resultsBox.innerHTML = matches.map(m => `
        <a href="${m.hash}" class="doc-search-item">
          <strong>${m.title}</strong>
          <span>${m.desc}</span>
        </a>
      `).join('');
      resultsBox.style.display = 'block';
    } else {
      resultsBox.innerHTML = `<div style="padding: 12px; color: var(--siar-text-muted); font-size: 0.8rem;">No documentation matches found.</div>`;
      resultsBox.style.display = 'block';
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
      resultsBox.style.display = 'none';
    }
  });
}

/**
 * Multi-Language Code Snippet Switcher
 */
function initCodeSnippetSwitcher() {
  const tabs = document.querySelectorAll('.lang-tab-btn');
  const codeBox = document.getElementById('sdkCodeDisplay');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const lang = tab.getAttribute('data-lang');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (codeBox && SDK_SNIPPETS[lang]) {
        codeBox.textContent = SDK_SNIPPETS[lang];
      }
    });
  });
}

/**
 * Interactive Postcard Wire Frame Builder
 */
function initWireFrameBuilder() {
  const selectType = document.getElementById('wireFrameType');
  const chkEncrypted = document.getElementById('wireEncrypted');
  const chkDtn = document.getElementById('wireDtn');
  const chkSos = document.getElementById('wireSos');
  const inputSeq = document.getElementById('wireSeqNum');
  const inputPayload = document.getElementById('wirePayloadText');

  const outputHex = document.getElementById('wireBuilderHex');
  const outputAst = document.getElementById('wireBuilderAst');
  const outputBytesCount = document.getElementById('wireByteCount');

  function updateWireCalculation() {
    if (!outputHex || !outputAst) return;

    // Magic bytes: b"SIAR" + version 1
    const bytes = [0x53, 0x49, 0x41, 0x52, 0x01, 0x00];
    
    // Frame type
    const frameTypeVal = selectType ? parseInt(selectType.value) : 0x03;
    bytes.push(frameTypeVal);

    // Flags
    let flags = 0x00;
    if (chkEncrypted && chkEncrypted.checked) flags |= 0x01;
    if (chkDtn && chkDtn.checked) flags |= 0x02;
    if (chkSos && chkSos.checked) flags |= 0x04;
    bytes.push(flags);

    // Fixed dummy source & dest 32 bytes
    const srcBytes = [0x7a, 0x4f, 0xb9, 0x18, 0xcc, 0x3d, 0xa1, 0x0e, 0xf4, 0x9b, 0x12, 0x77, 0x41, 0xd4, 0x73, 0x5e, 0x3a, 0x26, 0x5e, 0x16, 0xee, 0xe0, 0x3f, 0x59, 0x71, 0x8b, 0x9b, 0x5d, 0x03, 0x01, 0x9c, 0x07];
    const dstBytes = [0x9b, 0x12, 0x88, 0xff, 0x12, 0xbc, 0x90, 0x22, 0x10, 0x01, 0x4b, 0x77, 0xd4, 0xdd, 0x1f, 0xc6, 0x1c, 0x6f, 0x88, 0x4f, 0x48, 0x64, 0x1d, 0x02, 0xb4, 0xd1, 0x21, 0xd3, 0xfd, 0x32, 0x8c, 0xb0];
    bytes.push(...srcBytes);
    bytes.push(...dstBytes);

    // Sequence
    const seq = inputSeq ? (parseInt(inputSeq.value) || 104) : 104;
    for (let i = 0; i < 8; i++) bytes.push((seq >> (i * 8)) & 0xFF);

    // Timestamp
    const now = Date.now();
    for (let i = 0; i < 8; i++) bytes.push(Math.floor(now / Math.pow(256, i)) & 0xFF);

    // Payload
    const text = inputPayload ? inputPayload.value : "Emergency Relay";
    const enc = new TextEncoder();
    const payloadBytes = enc.encode(text);
    bytes.push(...payloadBytes);

    // Hex String
    const hexFormatted = bytes.map(b => b.toString(16).padStart(2, '0')).join(' ');
    outputHex.textContent = hexFormatted;
    if (outputBytesCount) outputBytesCount.textContent = `${bytes.length} bytes (Postcard Envelope)`;

    // AST
    const ast = {
      "TransportFrame": {
        "header": {
          "magic": "SIAR (0x53 0x49 0x41 0x52)",
          "protocol_version": 1,
          "frame_type": frameTypeVal === 0x0F ? "EmergencyAlert (0x0F)" : "DataBundle (0x03)",
          "flags": {
            "encrypted": !!(flags & 0x01),
            "dtn_forwardable": !!(flags & 0x02),
            "emergency_sos": !!(flags & 0x04)
          },
          "source_id": "ed25519:7a4fb918cc3d...",
          "destination_id": "ed25519:9b1288ff12bc...",
          "sequence_number": seq,
          "timestamp_ms": now,
          "payload_len": payloadBytes.length
        },
        "payload": {
          "raw_text": text,
          "bytes_len": payloadBytes.length
        }
      }
    };
    outputAst.textContent = JSON.stringify(ast, null, 2);
  }

  [selectType, chkEncrypted, chkDtn, chkSos, inputSeq, inputPayload].forEach(el => {
    if (el) {
      el.addEventListener('input', updateWireCalculation);
      el.addEventListener('change', updateWireCalculation);
    }
  });

  updateWireCalculation();
}

/**
 * Interactive Peer Ticket & OpenMLS Studio (Part XI)
 */
function initPeerTicketStudio() {
  const btnGen = document.getElementById('btnGenIdentity');
  const txtAlias = document.getElementById('ticketAlias');
  const txtAddress = document.getElementById('ticketAddressOutput');
  const txtQrOutput = document.getElementById('ticketQrOutput');
  const txtMlsStatus = document.getElementById('mlsStatusOutput');
  const btnStepMls = document.getElementById('btnStepMlsEpoch');

  let currentEpoch = 1;

  if (btnGen) {
    btnGen.addEventListener('click', () => {
      const alias = txtAlias ? txtAlias.value : 'Medic-Alpha';
      const randHex = Array.from(new Uint8Array(10)).map(() => Math.floor(Math.random()*16).toString(16)).join('');
      const addr = `siar1${randHex}`;
      
      if (txtAddress) txtAddress.textContent = addr;

      const dummyTicket = {
        magic: "SIAR",
        version: 1,
        alias: alias,
        address: addr,
        transports: ["BLE_5_Extended", "WiFi_Direct_P2P"],
        capabilities: ["DTN_StoreCarryForward", "Emergency_SOS"],
        sig: "ed25519_sig_" + randHex
      };

      const b64 = btoa(JSON.stringify(dummyTicket)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      if (txtQrOutput) txtQrOutput.textContent = `siar:ticket:${b64}`;
    });
  }

  if (btnStepMls) {
    btnStepMls.addEventListener('click', () => {
      currentEpoch += 1;
      if (txtMlsStatus) {
        txtMlsStatus.textContent = `Active Epoch: ${currentEpoch} | Tree-KEM Root Secret: ${Array.from(new Uint8Array(8)).map(() => Math.floor(Math.random()*16).toString(16)).join('')}... (Post-Compromise Security Active)`;
      }
    });
  }
}

/**
 * Interactive Multi-Transport ETX & Airtime Calculator (Part XII)
 */
function initEtxCalculator() {
  const rangeForward = document.getElementById('rangeForwardDelivery');
  const rangeReverse = document.getElementById('rangeReverseDelivery');
  const txtEtxOutput = document.getElementById('etxResultOutput');
  const selectSf = document.getElementById('loraSfSelect');
  const selectBw = document.getElementById('loraBwSelect');
  const txtToaOutput = document.getElementById('loraToaOutput');

  function calculateEtx() {
    const df = rangeForward ? parseFloat(rangeForward.value) : 0.95;
    const dr = rangeReverse ? parseFloat(rangeReverse.value) : 0.90;
    const etx = 1.0 / (df * dr);
    if (txtEtxOutput) {
      txtEtxOutput.textContent = `ETX: ${etx.toFixed(3)} ${etx < 2.5 ? '🟢 Viable Link' : '🔴 High Loss'}`;
    }
  }

  function calculateToa() {
    const sf = selectSf ? parseInt(selectSf.value) : 7;
    const bw = selectBw ? parseInt(selectBw.value) : 250000;
    const tSymbol = Math.pow(2, sf) / bw;
    const toaMs = Math.round((12.25 + 28.0) * tSymbol * 1000);
    const maxHourly = Math.floor(36000 / toaMs);
    if (txtToaOutput) {
      txtToaOutput.textContent = `Time-on-Air: ${toaMs} ms | ETSI 1% Hourly Quota: ${maxHourly} bursts/hour`;
    }
  }

  [rangeForward, rangeReverse].forEach(el => el && el.addEventListener('input', calculateEtx));
  [selectSf, selectBw].forEach(el => el && el.addEventListener('change', calculateToa));

  calculateEtx();
  calculateToa();
}

/**
 * Anti-Sybil Proof-of-Work Miner Playground (Part XV)
 */
function initPowMinerPlayground() {
  const btnMine = document.getElementById('btnStartPowMine');
  const selectDiff = document.getElementById('powDifficultySelect');
  const txtPowStatus = document.getElementById('powMiningStatus');

  if (btnMine) {
    btnMine.addEventListener('click', () => {
      const diff = selectDiff ? parseInt(selectDiff.value) : 8;
      if (txtPowStatus) txtPowStatus.textContent = `Mining BLAKE3 challenge at ${diff} bits difficulty...`;

      let nonce = 0;
      const startTime = performance.now();
      
      const interval = setInterval(() => {
        nonce += 137;
        if (nonce > 1500) {
          clearInterval(interval);
          const elapsed = (performance.now() - startTime).toFixed(1);
          const hash = `00${Array.from(new Uint8Array(15)).map(() => Math.floor(Math.random()*16).toString(16)).join('')}`;
          if (txtPowStatus) {
            txtPowStatus.textContent = `✅ Solved in ${elapsed}ms! Nonce: ${nonce} | Hash: ${hash}`;
          }
        }
      }, 50);
    });
  }
}

/**
 * Live Prometheus Telemetry Viewer (Part XVI)
 */
function initPrometheusLiveViewer() {
  const preProm = document.getElementById('prometheusLiveText');
  if (!preProm) return;

  function updatePrometheusMetrics() {
    const blePeers = 3 + Math.floor(Math.random() * 3);
    const wifiPeers = 1 + Math.floor(Math.random() * 2);
    const dtnBytes = 4194304 + Math.floor(Math.random() * 50000);
    
    preProm.textContent = `# HELP siar_active_neighbors Number of reachable radio mesh peers
# TYPE siar_active_neighbors gauge
siar_active_neighbors{transport="ble"} ${blePeers}
siar_active_neighbors{transport="wifi_direct"} ${wifiPeers}
siar_active_neighbors{transport="lora"} 12

# HELP siar_dtn_queue_bundles Stored DTN bundle count by priority
# TYPE siar_dtn_queue_bundles gauge
siar_dtn_queue_bundles{priority="sos"} 1
siar_dtn_queue_bundles{priority="normal"} 14
siar_dtn_queue_bundles{priority="bulk"} 3

# HELP siar_dtn_storage_bytes Stored DTN flash memory footprint
# TYPE siar_dtn_storage_bytes gauge
siar_dtn_storage_bytes ${dtnBytes}

# HELP siar_frames_transferred_total Total frames transmitted and received
# TYPE siar_frames_transferred_total counter
siar_frames_transferred_total{direction="rx",transport="ble"} 14209
siar_frames_transferred_total{direction="tx",transport="ble"} 11842`;
  }

  updatePrometheusMetrics();
  setInterval(updatePrometheusMetrics, 3000);
}

/**
 * JSON-RPC 2.0 Method Tester
 */
function initRpcTester() {
  const methodSelect = document.getElementById('rpcMethodSelect');
  const reqOutput = document.getElementById('rpcRequestOutput');
  const resOutput = document.getElementById('rpcResponseOutput');

  const RPC_DATA = {
    siar_get_node_info: {
      req: {
        jsonrpc: "2.0",
        method: "siar_get_node_info",
        params: {},
        id: 1
      },
      res: {
        jsonrpc: "2.0",
        result: {
          node_id: "siar17a4fb918cc3da10e",
          alias: "SIAR-Emergency-Repeater",
          uptime_seconds: 84120,
          active_neighbors: 14,
          dtn_queue_bundles: 18,
          storage_used_bytes: 4194304
        },
        id: 1
      }
    },
    siar_get_mesh_topology: {
      req: {
        jsonrpc: "2.0",
        method: "siar_get_mesh_topology",
        params: { "include_link_metrics": true },
        id: 2
      },
      res: {
        jsonrpc: "2.0",
        result: {
          neighbors: [
            {
              peer_id: "siar19b1288ff12bc9022",
              alias: "Field Medic 1",
              transport: "BLE",
              rssi_dbm: -64,
              snr_db: 14.5,
              etx: 1.05
            }
          ]
        },
        id: 2
      }
    },
    siar_inject_sos: {
      req: {
        jsonrpc: "2.0",
        method: "siar_inject_sos",
        params: {
          message: "SOS: Field hospital medical supplies low at Sector 4",
          coordinates: [37.7749, -122.4194]
        },
        id: 3
      },
      res: {
        jsonrpc: "2.0",
        result: {
          status: "SOS_BROADCAST_QUEUED",
          priority: "EMERGENCY_SOS",
          ttl_hours: 72,
          relayed_interfaces: ["BLE", "WiFiDirect", "LoRa", "QUIC"]
        },
        id: 3
      }
    }
  };

  if (methodSelect && reqOutput && resOutput) {
    methodSelect.addEventListener('change', (e) => {
      const m = e.target.value;
      if (RPC_DATA[m]) {
        reqOutput.textContent = JSON.stringify(RPC_DATA[m].req, null, 2);
        resOutput.textContent = JSON.stringify(RPC_DATA[m].res, null, 2);
      }
    });
  }
}

/**
 * Sidebar ScrollSpy Navigation
 */
function initDocScrollspy() {
  const links = document.querySelectorAll('.doc-nav-link');
  const sections = document.querySelectorAll('.doc-section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) {
        l.classList.add('active');
      }
    });
  });
}
