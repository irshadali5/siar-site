/**
 * SIAR Advanced WASM Topology Simulator & Postcard Protocol Studio
 * Architecture: Part 04 - In-Browser WASM Simulator & Protocol Playground
 * Domain: siar.irshad.org.in
 */

class WasmProtocolSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.nodes = [];
    this.packets = [];
    this.pulses = [];
    this.activeScenario = 'dtn_bridge';
    this.isPlaying = true;
    this.isAirGapActive = false;
    this.selectedNode = null;
    this.draggedNode = null;

    // Postcard Wire Inspector State
    this.currentFlags = {
      isDtn: true,
      isEmergency: false,
      seq: 104
    };

    // Initialize WebWorker
    this.initWorker();
    this.initCanvasSize();
    this.loadScenario('dtn_bridge');
    this.bindEvents();
    this.render();
  }

  initWorker() {
    try {
      this.worker = new Worker('js/wasm-worker.js');
      this.worker.onmessage = (e) => {
        const { success, result, error } = e.data;
        if (success && result) {
          if (result.hexLines && result.ast) {
            this.updateInspectorUI(result);
          } else if (result.commitHash) {
            this.logConsole(`[WASM MLS] Key Ratchet to Epoch ${result.epoch} complete (${result.commitHash})`, 'ok');
          }
        }
      };
    } catch (err) {
      console.warn('WebWorker initialization failed, using local fallback:', err);
      this.worker = null;
    }
  }

  postWorkerAction(action, payload) {
    if (this.worker) {
      this.worker.postMessage({ action, payload, id: Date.now() });
    } else {
      // Local fallback
      this.executeLocalFallback(action, payload);
    }
  }

  executeLocalFallback(action, payload) {
    if (action === 'ENCODE_POSTCARD_FRAME') {
      const now = Date.now();
      const ast = {
        frame: "TransportFrame::DataBundle",
        header: {
          magic: "SIAR (0x53 0x49 0x41 0x52)",
          version: 1,
          frame_type: payload.isEmergency ? "EmergencyAlert (0x0F)" : "DataBundle (0x03)",
          flags: {
            encrypted_mls: true,
            dtn_forwardable: !!payload.isDtn,
            sos_emergency: !!payload.isEmergency
          },
          source: "ed25519:7a4fb918cc3d...",
          destination: "ed25519:9b1288ff12bc...",
          sequence: payload.seq || 104,
          timestamp_ms: now,
          hop_count: 2,
          max_hops: 8
        },
        payload: {
          encryption: "ChaCha20-Poly1305 (OpenMLS RFC 9420)",
          mls_epoch: 3,
          mls_generation: 14,
          auth_tag: "0xc0341a88ff12bc90"
        }
      };
      this.updateInspectorUI({ ast });
    }
  }

  initCanvasSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = 420;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  loadScenario(scenarioName) {
    this.activeScenario = scenarioName;
    this.nodes = [];
    this.packets = [];
    this.pulses = [];

    const w = this.width;
    const h = this.height;

    if (scenarioName === 'dtn_bridge') {
      // Scenario 1: Off-Grid Disaster DTN Bridge
      this.nodes.push({
        id: 'Shelter Alpha (Offline)',
        type: 'SHELTER',
        x: w * 0.18,
        y: h * 0.5,
        vx: 0,
        vy: 0,
        range: 130,
        battery: 98,
        dtnQueue: 12,
        isAnchor: true,
        desc: 'Air-gapped disaster shelter collecting emergency medical bundles.'
      });

      this.nodes.push({
        id: 'Patrol Vehicle 2',
        type: 'PATROL_VEHICLE',
        x: w * 0.35,
        y: h * 0.5,
        vx: 1.2,
        vy: 0,
        minX: w * 0.2,
        maxX: w * 0.8,
        range: 110,
        battery: 94,
        dtnQueue: 0,
        isMover: true,
        desc: 'Mobile DTN relay carrying bundles physically between air-gaps.'
      });

      this.nodes.push({
        id: 'Base Camp HQ',
        type: 'BASE_CAMP',
        x: w * 0.82,
        y: h * 0.5,
        vx: 0,
        vy: 0,
        range: 140,
        battery: 100,
        dtnQueue: 0,
        isAnchor: true,
        desc: 'Central command post receiving emergency bundles via physical motion.'
      });

      this.logConsole('🚀 Loaded Scenario 1: Off-Grid Disaster DTN Store-Carry-Forward Bridge.', 'info');

    } else if (scenarioName === 'mls_ratchet') {
      // Scenario 2: MLS Group Ratchet & Post-Compromise Security (PCS)
      this.nodes.push({
        id: 'Alice (Android)',
        type: 'MOBILE',
        x: w * 0.28,
        y: h * 0.35,
        vx: 0.2,
        vy: -0.15,
        range: 180,
        battery: 92,
        dtnQueue: 0,
        epoch: 1,
        desc: 'Group Admin. Holds MLS ratchet tree root key.'
      });

      this.nodes.push({
        id: 'Bob (Compromised?)',
        type: 'DESKTOP',
        x: w * 0.72,
        y: h * 0.35,
        vx: -0.2,
        vy: 0.15,
        range: 180,
        battery: 100,
        dtnQueue: 0,
        epoch: 1,
        isCompromised: false,
        desc: 'Group member subject to simulated device compromise.'
      });

      this.nodes.push({
        id: 'Charlie (Solar Node)',
        type: 'SOLAR_REPEATER',
        x: w * 0.5,
        y: h * 0.72,
        vx: 0,
        vy: 0,
        range: 200,
        battery: 99,
        dtnQueue: 0,
        epoch: 1,
        desc: 'Repeater broadcasting MLS Commit handshakes.'
      });

      this.logConsole('🛡️ Loaded Scenario 2: MLS Tree Ratchet & Post-Compromise Security (PCS).', 'info');

    } else if (scenarioName === 'multi_transport') {
      // Scenario 3: Multi-Transport Radio Path Fallback
      this.nodes.push({
        id: 'QUIC Internet Gateway',
        type: 'GATEWAY',
        x: w * 0.5,
        y: h * 0.2,
        vx: 0,
        vy: 0,
        range: 190,
        battery: 100,
        dtnQueue: 0,
        isGateway: true
      });

      this.nodes.push({
        id: 'Field Node 1',
        type: 'MOBILE',
        x: w * 0.25,
        y: h * 0.65,
        vx: 0.3,
        vy: 0.2,
        range: 150,
        battery: 88,
        dtnQueue: 0
      });

      this.nodes.push({
        id: 'Field Node 2',
        type: 'MOBILE',
        x: w * 0.75,
        y: h * 0.65,
        vx: -0.3,
        vy: -0.2,
        range: 150,
        battery: 81,
        dtnQueue: 0
      });

      this.logConsole('📡 Loaded Scenario 3: Multi-Transport Radio Path Fallback (QUIC/Wi-Fi/BLE).', 'info');
    }

    this.reencodeFrame();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initCanvasSize());

    this.canvas.addEventListener('mousedown', (e) => {
      const pos = this.getMousePos(e);
      const clicked = this.getNodeAt(pos.x, pos.y);
      if (clicked) {
        this.selectedNode = clicked;
        this.draggedNode = clicked;
        this.logConsole(`[NODE HUD] Selected ${clicked.id} (Battery: ${clicked.battery}%, DTN: ${clicked.dtnQueue} pkts)`, 'info');
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.draggedNode && !this.draggedNode.isAnchor) {
        const pos = this.getMousePos(e);
        this.draggedNode.x = Math.max(30, Math.min(this.width - 30, pos.x));
        this.draggedNode.y = Math.max(30, Math.min(this.height - 30, pos.y));
      }
    });

    window.addEventListener('mouseup', () => {
      this.draggedNode = null;
    });

    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const pos = this.getMousePos(e.touches[0]);
        const clicked = this.getNodeAt(pos.x, pos.y);
        if (clicked) {
          this.selectedNode = clicked;
          this.draggedNode = clicked;
        }
      }
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.draggedNode && !this.draggedNode.isAnchor && e.touches.length > 0) {
        const pos = this.getMousePos(e.touches[0]);
        this.draggedNode.x = Math.max(30, Math.min(this.width - 30, pos.x));
        this.draggedNode.y = Math.max(30, Math.min(this.height - 30, pos.y));
        e.preventDefault();
      }
    });

    this.canvas.addEventListener('touchend', () => {
      this.draggedNode = null;
    });
  }

  getMousePos(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  getNodeAt(x, y) {
    for (let node of this.nodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist < 24) return node;
    }
    return null;
  }

  reencodeFrame() {
    this.postWorkerAction('ENCODE_POSTCARD_FRAME', {
      isDtn: this.currentFlags.isDtn,
      isEmergency: this.currentFlags.isEmergency,
      seq: this.currentFlags.seq
    });
  }

  updateInspectorUI(data) {
    const hexView = document.getElementById('postcardHexDump');
    const astView = document.getElementById('postcardAstView');

    if (hexView && data.hexLines) {
      hexView.innerHTML = data.hexLines.map(line => `
        <div class="hex-row">
          <span class="hex-offset">${line.offset}</span>
          <span class="hex-bytes">${line.bytes}</span>
          <span class="hex-ascii">${line.ascii}</span>
        </div>
      `).join('');
    }

    if (astView && data.ast) {
      astView.textContent = JSON.stringify(data.ast, null, 2);
    }
  }

  logConsole(msg, type = 'info') {
    const logBox = document.getElementById('wasmSimConsole');
    if (!logBox) return;
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    const div = document.createElement('div');
    div.className = 'sim-log-line';
    div.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-${type}">${msg}</span>`;
    logBox.appendChild(div);
    logBox.scrollTop = logBox.scrollHeight;
  }

  spawnPacket(src, dst, transport = 'BLE', isEmergency = false) {
    this.packets.push({
      src,
      dst,
      progress: 0.0,
      speed: 0.02,
      transport,
      isEmergency
    });
  }

  triggerPulse(x, y, color = '#f43f5e') {
    this.pulses.push({
      x,
      y,
      radius: 6,
      maxRadius: Math.max(this.width, this.height) * 0.7,
      alpha: 1.0,
      color
    });
  }

  stepPhysics() {
    // 1. Scenario 1 Mover Logic (Patrol Vehicle)
    if (this.activeScenario === 'dtn_bridge') {
      const vehicle = this.nodes.find(n => n.isMover);
      const shelter = this.nodes.find(n => n.type === 'SHELTER');
      const baseCamp = this.nodes.find(n => n.type === 'BASE_CAMP');

      if (vehicle && shelter && baseCamp) {
        vehicle.x += vehicle.vx;
        if (vehicle.x >= vehicle.maxX) {
          vehicle.vx = -Math.abs(vehicle.vx);
          // Handshake with Base Camp: Drain DTN bundles!
          if (vehicle.dtnQueue > 0) {
            this.logConsole(`🤝 Vehicle proximity to Base Camp: Flushed ${vehicle.dtnQueue} bundles into HQ!`, 'ok');
            this.triggerPulse(baseCamp.x, baseCamp.y, '#10b981');
            vehicle.dtnQueue = 0;
          }
        } else if (vehicle.x <= vehicle.minX) {
          vehicle.vx = Math.abs(vehicle.vx);
          // Handshake with Shelter: Collect DTN bundles!
          if (shelter.dtnQueue > 0) {
            vehicle.dtnQueue = shelter.dtnQueue;
            this.logConsole(`📦 Vehicle proximity to Shelter Alpha: Ingested ${shelter.dtnQueue} DTN bundles!`, 'warn');
            this.triggerPulse(shelter.x, shelter.y, '#f59e0b');
          }
        }
      }
    } else {
      // General motion
      for (let n of this.nodes) {
        if (!n.isAnchor && n !== this.draggedNode) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 30 || n.x > this.width - 30) n.vx *= -1;
          if (n.y < 30 || n.y > this.height - 30) n.vy *= -1;
        }
      }
    }

    // 2. Update Packets
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.progress += p.speed;
      if (p.progress >= 1.0) {
        this.packets.splice(i, 1);
      }
    }

    // 3. Update Pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.radius += 4;
      pulse.alpha = Math.max(0, 1 - (pulse.radius / pulse.maxRadius));
      if (pulse.radius >= pulse.maxRadius) {
        this.pulses.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Links
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n1 = this.nodes[i];
        const n2 = this.nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        const maxRange = Math.max(n1.range, n2.range);

        if (dist < maxRange) {
          const alpha = 1 - (dist / maxRange);
          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);
          this.ctx.lineTo(n2.x, n2.y);
          this.ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.7})`;
          this.ctx.lineWidth = 1.8;
          this.ctx.stroke();
        }
      }
    }

    // 2. Draw Pulses
    for (let pulse of this.pulses) {
      this.ctx.beginPath();
      this.ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = pulse.color;
      this.ctx.lineWidth = 2.5;
      this.ctx.globalAlpha = pulse.alpha;
      this.ctx.stroke();
      this.ctx.globalAlpha = 1.0;
    }

    // 3. Draw Packets
    for (let p of this.packets) {
      const curX = p.src.x + (p.dst.x - p.src.x) * p.progress;
      const curY = p.src.y + (p.dst.y - p.src.y) * p.progress;
      this.ctx.beginPath();
      this.ctx.arc(curX, curY, p.isEmergency ? 7 : 4, 0, Math.PI * 2);
      this.ctx.fillStyle = p.isEmergency ? '#f43f5e' : '#00f2fe';
      this.ctx.shadowColor = this.ctx.fillStyle;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // 4. Draw Nodes
    for (let node of this.nodes) {
      const isSelected = (node === this.selectedNode);
      const radius = node.isAnchor ? 20 : (node.isMover ? 16 : 13);

      // Range
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.range, 0, Math.PI * 2);
      this.ctx.strokeStyle = node.isCompromised ? 'rgba(244, 63, 94, 0.12)' : 'rgba(0, 242, 254, 0.05)';
      this.ctx.stroke();

      // Node Body
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = node.isCompromised ? '#3f121a' : (node.isAnchor ? '#15132d' : '#081726');
      this.ctx.strokeStyle = node.isCompromised ? '#f43f5e' : (isSelected ? '#ffffff' : '#00f2fe');
      this.ctx.lineWidth = isSelected ? 3 : 2;
      this.ctx.fill();
      this.ctx.stroke();

      // Label
      this.ctx.font = '10px "JetBrains Mono"';
      this.ctx.fillStyle = node.isCompromised ? '#f87171' : '#cbd5e1';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.id, node.x, node.y + radius + 15);

      // DTN Queue Badge
      if (node.dtnQueue > 0) {
        this.ctx.beginPath();
        this.ctx.arc(node.x + radius - 2, node.y - radius + 2, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.fill();
        this.ctx.fillStyle = '#050811';
        this.ctx.font = 'bold 9px "JetBrains Mono"';
        this.ctx.fillText(`${node.dtnQueue}`, node.x + radius - 2, node.y - radius + 5);
      }
    }
  }

  render() {
    if (this.isPlaying) {
      this.stepPhysics();
    }
    this.draw();
    requestAnimationFrame(() => this.render());
  }
}

// Attach to window
window.WasmProtocolSimulator = WasmProtocolSimulator;
