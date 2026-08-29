/**
 * SIAR Global Edge CDN & Infrastructure Monitor Engine
 * Architecture: Part 07 - Global Edge CDN, Storage & Routing Topology
 * Domain: siar.irshad.org.in | pkg.siar.irshad.org.in
 */

const INFRA_STATE = {
  tier1_r2: { name: "Cloudflare R2 Global Primary", status: "HEALTHY", uptime: "99.99%", latency: "12ms", location: "Global Anycast (300+ PoPs)" },
  tier2_minio: { name: "MinIO EU Sovereign Mirror", status: "HEALTHY", uptime: "99.98%", latency: "18ms", location: "Hetzner (Falkenstein & Helsinki)" },
  tier3_b2: { name: "Backblaze B2 Cold Archive", status: "IMMUTABLE", uptime: "100.00%", latency: "45ms", location: "US-West & EU-Central (Object Lock)" }
};

let isTier1SimulatedDown = false;

document.addEventListener('DOMContentLoaded', () => {
  initGeoRoutingSimulator();
  initCircuitBreakerToggle();
  initIpAnonymizerTool();
  initLiveHealthProbes();
});

/**
 * Geo-Routing Simulator
 */
function initGeoRoutingSimulator() {
  const selectRegion = document.getElementById('simClientRegion');
  const selectPkg = document.getElementById('simTargetPackage');
  const btnRun = document.getElementById('btnRunRoutingSim');
  const outputBox = document.getElementById('routingSimOutput');

  function runSimulation() {
    if (!outputBox) return;

    const region = selectRegion ? selectRegion.value : "NA";
    const pkg = selectPkg ? selectPkg.value : "/latest/android-apk";

    let selectedTier = "Tier 1: Cloudflare R2 Global Primary";
    let mirrorUrl = "https://r2-origin.siar.irshad.org.in";
    let latency = "14ms";
    let edgeColo = "IAD (Ashburn, VA)";

    if (region === 'EU') {
      edgeColo = "FRA (Frankfurt, DE)";
      latency = "16ms";
    } else if (region === 'APAC') {
      edgeColo = "NRT (Tokyo, JP)";
      latency = "28ms";
    } else if (region === 'LATAM') {
      edgeColo = "GRU (São Paulo, BR)";
      latency = "36ms";
    } else if (region === 'OCEANIA') {
      edgeColo = "SYD (Sydney, AU)";
      latency = "42ms";
    }

    if (isTier1SimulatedDown) {
      selectedTier = "Tier 2: MinIO EU Sovereign (Hetzner Germany) [FAILOVER ACTIVE]";
      mirrorUrl = "https://eu-mirror.siar.irshad.org.in";
      latency = "24ms";
    }

    let resolvedFile = "/releases/siar-messenger-0.1.0-universal.apk";
    if (pkg.includes('deb')) resolvedFile = "/deb/pool/main/s/siar-desktop/siar-desktop_0.1.0_amd64.deb";
    if (pkg.includes('tar.gz')) resolvedFile = "/releases/siar-cli-v0.1.0-x86_64-unknown-linux-musl.tar.gz";

    outputBox.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px; font-family: var(--font-mono); font-size: 0.8rem;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--siar-border-subtle); padding-bottom: 8px;">
          <span style="color: var(--siar-text-muted);">Closest Anycast Edge PoP:</span>
          <strong style="color: var(--siar-cyan-glow);">${edgeColo}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--siar-border-subtle); padding-bottom: 8px;">
          <span style="color: var(--siar-text-muted);">Target Storage Mirror:</span>
          <strong style="color: ${isTier1SimulatedDown ? 'var(--siar-amber-warning)' : 'var(--siar-emerald-online)'};">${selectedTier}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--siar-border-subtle); padding-bottom: 8px;">
          <span style="color: var(--siar-text-muted);">Resolved Origin URI:</span>
          <span style="color: #38bdf8;">${mirrorUrl}${resolvedFile}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--siar-border-subtle); padding-bottom: 8px;">
          <span style="color: var(--siar-text-muted);">Round-Trip Latency:</span>
          <span style="color: var(--siar-emerald-online);">${latency}</span>
        </div>
        <div style="background: #040609; padding: 10px; border-radius: 4px; border: 1px solid var(--siar-border-subtle); color: #cbd5e1; font-size: 0.74rem;">
          HTTP/2 200 OK<br>
          X-SIAR-Mirror: ${selectedTier.split(':')[1].trim()}<br>
          X-SIAR-Privacy: Zero-Tracking-Verified<br>
          Cache-Control: public, max-age=86400, immutable<br>
          Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
        </div>
      </div>
    `;
  }

  if (selectRegion) selectRegion.addEventListener('change', runSimulation);
  if (selectPkg) selectPkg.addEventListener('change', runSimulation);
  if (btnRun) btnRun.addEventListener('click', runSimulation);

  runSimulation();
}

/**
 * Circuit Breaker Outage Simulator Toggle
 */
function initCircuitBreakerToggle() {
  const btnToggle = document.getElementById('btnToggleTier1Outage');
  const statusBadge = document.getElementById('tier1StatusBadge');
  const simOutput = document.getElementById('routingSimOutput');

  if (!btnToggle || !statusBadge) return;

  btnToggle.addEventListener('click', () => {
    isTier1SimulatedDown = !isTier1SimulatedDown;
    if (isTier1SimulatedDown) {
      statusBadge.textContent = 'SIMULATED OUTAGE (FAILOVER ACTIVE)';
      statusBadge.style.background = 'rgba(244, 63, 94, 0.2)';
      statusBadge.style.color = '#f43f5e';
      statusBadge.style.borderColor = '#f43f5e';
      btnToggle.textContent = '🟢 Restore Tier 1 Primary Origin';
      btnToggle.className = 'btn btn-primary btn-sm';
    } else {
      statusBadge.textContent = 'HEALTHY (PRIMARY ACTIVE)';
      statusBadge.style.background = 'rgba(16, 185, 129, 0.12)';
      statusBadge.style.color = 'var(--siar-emerald-online)';
      statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      btnToggle.textContent = '⚡ Simulate Tier 1 Outage (Test Failover)';
      btnToggle.className = 'btn btn-secondary btn-sm';
    }

    const selectRegion = document.getElementById('simClientRegion');
    if (selectRegion) {
      selectRegion.dispatchEvent(new Event('change'));
    }
  });
}

/**
 * IP Anonymizer Tool
 */
function initIpAnonymizerTool() {
  const inputIp = document.getElementById('inputTestIp');
  const outputAnonymized = document.getElementById('outputAnonymizedIp');
  const outputLog = document.getElementById('outputNginxLog');

  if (!inputIp || !outputAnonymized || !outputLog) return;

  function anonymize(ip) {
    if (ip.includes(':')) {
      const parts = ip.split(':');
      return parts.slice(0, 3).join(':') + '::';
    } else {
      const parts = ip.split('.');
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
      }
    }
    return '0.0.0.0';
  }

  function update() {
    const rawIp = inputIp.value.trim() || '198.51.100.42';
    const anon = anonymize(rawIp);
    outputAnonymized.textContent = anon;
    outputLog.textContent = `${anon} - - [29/Aug/2026:22:30:00 +0000] "GET /latest/android-apk HTTP/2.0" 200 28416000 "-" "-"`;
  }

  inputIp.addEventListener('input', update);
  update();
}

/**
 * Simulated Live Health Probes
 */
function initLiveHealthProbes() {
  const probeContainer = document.getElementById('liveHealthProbeGrid');
  if (!probeContainer) return;

  const POPS = [
    { city: "Ashburn (IAD)", region: "North America", latency: "9ms", status: "HEALTHY" },
    { city: "Frankfurt (FRA)", region: "Europe", latency: "14ms", status: "HEALTHY" },
    { city: "Tokyo (NRT)", region: "Asia-Pacific", latency: "26ms", status: "HEALTHY" },
    { city: "London (LHR)", region: "Europe", latency: "12ms", status: "HEALTHY" },
    { city: "São Paulo (GRU)", region: "Latin America", latency: "34ms", status: "HEALTHY" },
    { city: "Sydney (SYD)", region: "Oceania", latency: "41ms", status: "HEALTHY" }
  ];

  probeContainer.innerHTML = POPS.map(pop => `
    <div class="siar-glass-card" style="padding: 14px; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <strong style="font-size: 0.88rem; color: #ffffff;">${pop.city}</strong>
        <div style="font-size: 0.72rem; color: var(--siar-text-muted); font-family: var(--font-mono);">${pop.region}</div>
      </div>
      <div style="text-align: right;">
        <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--siar-emerald-online); font-weight: 700;">● ${pop.status}</span>
        <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--siar-cyan-glow);">${pop.latency}</div>
      </div>
    </div>
  `).join('');
}
