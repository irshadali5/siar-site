/**
 * SIAR Mesh Topology & Particle Physics Simulation Engine
 * Architecture: Part 01 - Section 4 Canvas Visualizer
 * Domain: siar.irshad.org.in
 */

class MeshSimulationEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.nodes = [];
    this.packets = [];
    this.pulses = [];
    this.selectedNode = null;
    this.draggedNode = null;
    this.isAirGapActive = false;
    this.animationFrameId = null;

    // Transport Color Palette
    this.colors = {
      bg: '#040609',
      repeater: '#8b5cf6',
      mobile: '#00f2fe',
      desktop: '#38bdf8',
      linkBle: 'rgba(0, 242, 254, 0.45)',
      linkWifi: 'rgba(16, 185, 129, 0.55)',
      linkQuic: 'rgba(59, 130, 246, 0.65)',
      linkDtn: 'rgba(245, 158, 11, 0.75)',
      packetBle: '#00f2fe',
      packetWifi: '#10b981',
      packetQuic: '#3b82f6',
      packetDtn: '#f59e0b',
      sosGlow: '#f43f5e'
    };

    this.initCanvasSize();
    this.initTopology();
    this.bindEvents();
    this.startPacketSpawner();
    this.render();
  }

  initCanvasSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = 380;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  initTopology() {
    this.nodes = [];
    // 1. Central Emergency Solar Repeater
    this.nodes.push({
      id: 'REP-01 (Bunker)',
      type: 'EMERGENCY_REPEATER',
      x: this.width * 0.5,
      y: this.height * 0.5,
      vx: 0,
      vy: 0,
      range: 190,
      battery: 99,
      dtnQueue: 0,
      isRepeater: true,
      lastSeen: 'Active'
    });

    // 2. Mobile and Desktop nodes surrounding repeater
    const initialNodes = [
      { id: 'Alice (Android)', type: 'MOBILE_CLIENT', relX: 0.22, relY: 0.28, range: 130, battery: 91 },
      { id: 'Bob (Desktop)', type: 'DESKTOP_CLIENT', relX: 0.78, relY: 0.25, range: 140, battery: 100 },
      { id: 'Charlie (Solar Node)', type: 'MOBILE_CLIENT', relX: 0.82, relY: 0.75, range: 130, battery: 78 },
      { id: 'Dave (Field Android)', type: 'MOBILE_CLIENT', relX: 0.28, relY: 0.78, range: 130, battery: 84 },
      { id: 'Eva (Vehicle DTN)', type: 'MOBILE_CLIENT', relX: 0.5, relY: 0.18, range: 150, battery: 95 },
      { id: 'Frank (Shelter Node)', type: 'MOBILE_CLIENT', relX: 0.12, relY: 0.52, range: 125, battery: 67 }
    ];

    initialNodes.forEach(item => {
      this.nodes.push({
        id: item.id,
        type: item.type,
        x: this.width * item.relX,
        y: this.height * item.relY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        range: item.range,
        battery: item.battery,
        dtnQueue: Math.floor(Math.random() * 4),
        isRepeater: false,
        lastSeen: 'Active'
      });
    });

    this.updateStatsCounters();
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
    });

    this.canvas.addEventListener('mousedown', (e) => {
      const pos = this.getMousePos(e);
      const clicked = this.getNodeAt(pos.x, pos.y);
      if (clicked) {
        this.draggedNode = clicked;
        this.selectedNode = clicked;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.draggedNode) {
        const pos = this.getMousePos(e);
        this.draggedNode.x = Math.max(20, Math.min(this.width - 20, pos.x));
        this.draggedNode.y = Math.max(20, Math.min(this.height - 20, pos.y));
      }
    });

    window.addEventListener('mouseup', () => {
      this.draggedNode = null;
    });

    // Touch support for mobile devices
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const pos = this.getMousePos(touch);
        const clicked = this.getNodeAt(pos.x, pos.y);
        if (clicked) {
          this.draggedNode = clicked;
          this.selectedNode = clicked;
        }
      }
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.draggedNode && e.touches.length > 0) {
        const touch = e.touches[0];
        const pos = this.getMousePos(touch);
        this.draggedNode.x = Math.max(20, Math.min(this.width - 20, pos.x));
        this.draggedNode.y = Math.max(20, Math.min(this.height - 20, pos.y));
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
      if (dist < (node.isRepeater ? 22 : 16)) {
        return node;
      }
    }
    return null;
  }

  spawnNode() {
    if (this.nodes.length >= 14) return;
    const idNum = this.nodes.length + 1;
    this.nodes.push({
      id: `Node-${idNum} (New)`,
      type: 'MOBILE_CLIENT',
      x: 50 + Math.random() * (this.width - 100),
      y: 50 + Math.random() * (this.height - 100),
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      range: 135,
      battery: Math.floor(70 + Math.random() * 30),
      dtnQueue: 0,
      isRepeater: false,
      lastSeen: 'Just joined'
    });
    this.updateStatsCounters();
  }

  toggleAirGap() {
    this.isAirGapActive = !this.isAirGapActive;
    if (this.isAirGapActive) {
      // Simulate air-gap by cutting ranges & increasing DTN queues
      this.nodes.forEach(n => {
        if (!n.isRepeater) {
          n.range *= 0.65;
          n.dtnQueue += 3;
        }
      });
    } else {
      this.nodes.forEach(n => {
        if (!n.isRepeater) {
          n.range /= 0.65;
          n.dtnQueue = Math.max(0, n.dtnQueue - 2);
        }
      });
    }
    this.updateStatsCounters();
    return this.isAirGapActive;
  }

  triggerEmergencyBroadcast() {
    const centerNode = this.nodes[0] || { x: this.width / 2, y: this.height / 2 };
    this.pulses.push({
      x: centerNode.x,
      y: centerNode.y,
      radius: 5,
      maxRadius: Math.max(this.width, this.height) * 0.75,
      alpha: 1.0,
      color: this.colors.sosGlow
    });

    // Send rapid burst packets
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes.length; j++) {
        if (i !== j) {
          const dist = Math.hypot(this.nodes[i].x - this.nodes[j].x, this.nodes[i].y - this.nodes[j].y);
          if (dist < this.nodes[i].range) {
            this.packets.push({
              source: this.nodes[i],
              target: this.nodes[j],
              progress: 0.0,
              speed: 0.025,
              transport: 'DTN',
              isEmergency: true
            });
          }
        }
      }
    }
    this.updateStatsCounters();
  }

  startPacketSpawner() {
    setInterval(() => {
      if (this.nodes.length < 2) return;
      
      // Find pair within range
      const validPairs = [];
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const dist = Math.hypot(this.nodes[i].x - this.nodes[j].x, this.nodes[i].y - this.nodes[j].y);
          if (dist < Math.max(this.nodes[i].range, this.nodes[j].range)) {
            let transport = 'BLE';
            if (dist < 80) transport = 'WIFI_DIRECT';
            else if (this.nodes[i].isRepeater || this.nodes[j].isRepeater) transport = 'QUIC';
            else if (this.isAirGapActive) transport = 'DTN';

            validPairs.push({ src: this.nodes[i], dst: this.nodes[j], transport });
          }
        }
      }

      if (validPairs.length > 0 && this.packets.length < 20) {
        const pick = validPairs[Math.floor(Math.random() * validPairs.length)];
        const direction = Math.random() > 0.5;
        this.packets.push({
          source: direction ? pick.src : pick.dst,
          target: direction ? pick.dst : pick.src,
          progress: 0.0,
          speed: 0.012 + Math.random() * 0.015,
          transport: pick.transport,
          isEmergency: false
        });
      }
      this.updateStatsCounters();
    }, 450);
  }

  updatePhysics() {
    for (let node of this.nodes) {
      if (node.isRepeater) continue; // Repeater stays anchored or moves very slowly

      if (node !== this.draggedNode) {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off canvas boundaries
        if (node.x < 30 || node.x > this.width - 30) node.vx *= -1;
        if (node.y < 30 || node.y > this.height - 30) node.vy *= -1;
      }
    }

    // Update packets
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.progress += p.speed;
      if (p.progress >= 1.0) {
        // Arrived at destination
        if (p.target.dtnQueue > 0 && Math.random() > 0.6) {
          p.target.dtnQueue = Math.max(0, p.target.dtnQueue - 1);
        }
        this.packets.splice(i, 1);
      }
    }

    // Update emergency pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.radius += 4.5;
      pulse.alpha = Math.max(0, 1 - (pulse.radius / pulse.maxRadius));
      if (pulse.radius >= pulse.maxRadius) {
        this.pulses.splice(i, 1);
      }
    }
  }

  drawLinks() {
    let linkCount = 0;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n1 = this.nodes[i];
        const n2 = this.nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        const maxRange = Math.max(n1.range, n2.range);

        if (dist < maxRange) {
          linkCount++;
          const alpha = 1 - (dist / maxRange);
          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);
          this.ctx.lineTo(n2.x, n2.y);

          // Select transport link styling
          if (dist < 80) {
            this.ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.75})`;
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([4, 2]);
          } else if (n1.isRepeater || n2.isRepeater) {
            this.ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.75})`;
            this.ctx.lineWidth = 1.8;
            this.ctx.setLineDash([]);
          } else {
            this.ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.55})`;
            this.ctx.lineWidth = 1.2;
            this.ctx.setLineDash([2, 4]);
          }

          this.ctx.stroke();
          this.ctx.setLineDash([]);
        }
      }
    }
    this.currentLinkCount = linkCount;
  }

  drawPackets() {
    for (let p of this.packets) {
      const currentX = p.source.x + (p.target.x - p.source.x) * p.progress;
      const currentY = p.source.y + (p.target.y - p.source.y) * p.progress;

      let color = this.colors.packetBle;
      if (p.transport === 'WIFI_DIRECT') color = this.colors.packetWifi;
      else if (p.transport === 'QUIC') color = this.colors.packetQuic;
      else if (p.transport === 'DTN') color = this.colors.packetDtn;
      if (p.isEmergency) color = this.colors.sosGlow;

      // Glow halo
      this.ctx.beginPath();
      this.ctx.arc(currentX, currentY, p.isEmergency ? 7 : 4, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }

  drawPulses() {
    for (let pulse of this.pulses) {
      this.ctx.beginPath();
      this.ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(244, 63, 94, ${pulse.alpha})`;
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
    }
  }

  drawNodes() {
    for (let node of this.nodes) {
      const isSelected = (node === this.selectedNode);
      const radius = node.isRepeater ? 18 : 11;

      // Draw range perimeter circle
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.range, 0, Math.PI * 2);
      this.ctx.strokeStyle = node.isRepeater ? 'rgba(139, 92, 246, 0.08)' : 'rgba(0, 242, 254, 0.04)';
      this.ctx.fillStyle = node.isRepeater ? 'rgba(139, 92, 246, 0.015)' : 'rgba(0, 242, 254, 0.01)';
      this.ctx.fill();
      this.ctx.stroke();

      // Draw Node Outer Ring
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius + (isSelected ? 4 : 0), 0, Math.PI * 2);
      this.ctx.fillStyle = node.isRepeater ? '#17112d' : '#081726';
      this.ctx.strokeStyle = isSelected ? '#ffffff' : (node.isRepeater ? '#8b5cf6' : '#00f2fe');
      this.ctx.lineWidth = node.isRepeater ? 2.5 : 1.8;
      this.ctx.shadowColor = node.isRepeater ? '#8b5cf6' : '#00f2fe';
      this.ctx.shadowBlur = isSelected ? 16 : 8;
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Draw Center Core Glyph
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius * 0.45, 0, Math.PI * 2);
      this.ctx.fillStyle = node.isRepeater ? '#a78bfa' : '#38bdf8';
      this.ctx.fill();

      // Node Label
      this.ctx.font = '10px "JetBrains Mono", monospace';
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.id.split(' ')[0], node.x, node.y + radius + 14);

      // DTN Queue Badge
      if (node.dtnQueue > 0) {
        this.ctx.beginPath();
        this.ctx.arc(node.x + radius - 2, node.y - radius + 2, 7, 0, Math.PI * 2);
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.fill();
        this.ctx.fillStyle = '#050811';
        this.ctx.font = 'bold 8px "JetBrains Mono"';
        this.ctx.fillText(`${node.dtnQueue}`, node.x + radius - 2, node.y - radius + 5);
      }
    }
  }

  updateStatsCounters() {
    const elNodes = document.getElementById('statMeshNodes');
    const elLinks = document.getElementById('statMeshLinks');
    const elPackets = document.getElementById('statMeshPackets');
    const elDtn = document.getElementById('statMeshDtn');

    let totalDtn = 0;
    this.nodes.forEach(n => totalDtn += (n.dtnQueue || 0));

    if (elNodes) elNodes.textContent = this.nodes.length;
    if (elLinks) elLinks.textContent = this.currentLinkCount || 0;
    if (elPackets) elPackets.textContent = this.packets.length;
    if (elDtn) elDtn.textContent = totalDtn;
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updatePhysics();
    this.drawLinks();
    this.drawPulses();
    this.drawPackets();
    this.drawNodes();

    this.animationFrameId = requestAnimationFrame(() => this.render());
  }
}

window.MeshSimulationEngine = MeshSimulationEngine;
