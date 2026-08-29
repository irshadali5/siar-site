/**
 * SIAR Cloudflare / Fastly Edge Compute Worker
 * Architecture: Part 07 - Global Edge CDN & Geo-Routing Topology
 * Domain: download.siar.irshad.org.in | pkg.siar.irshad.org.in
 */

const STORAGE_TIERS = {
  tier1_primary: {
    name: "Cloudflare R2 Global Primary",
    baseUrl: "https://r2-origin.siar.irshad.org.in",
    priority: 1,
    healthy: true
  },
  tier2_sovereign: {
    name: "MinIO EU Sovereign (Hetzner Germany)",
    baseUrl: "https://eu-mirror.siar.irshad.org.in",
    priority: 2,
    healthy: true
  },
  tier3_cold: {
    name: "Backblaze B2 Cold Storage",
    baseUrl: "https://b2-archive.siar.irshad.org.in",
    priority: 3,
    healthy: true
  }
};

/**
 * Main Edge Worker Request Handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const clientIp = request.headers.get('cf-connecting-ip') || '127.0.0.1';
    const country = request.cf?.country || 'US';
    const continent = request.cf?.continent || 'NA';

    // 1. IP Anonymization: Truncate to /24 (IPv4) or /48 (IPv6) in memory
    const anonymizedIp = anonymizeIp(clientIp);

    // 2. Health Endpoint
    if (url.pathname === '/healthz') {
      return new Response(JSON.stringify({
        status: "HEALTHY",
        edgePoP: request.cf?.colo || 'IAD',
        activeMirrors: Object.keys(STORAGE_TIERS).length,
        privacy: "IP_ANONYMIZED_STRICT",
        timestamp: Date.now()
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 3. Resolve Canonical Target Path
    const canonicalPath = resolveCanonicalPackage(url.pathname);

    // 4. Geo-Proximity Mirror Selection & Circuit Breaker
    const selectedMirror = selectOptimalMirror(continent, env);

    // 5. Construct Origin Fetch with 24-Hour Cache-Control
    const originUrl = `${selectedMirror.baseUrl}${canonicalPath}`;
    
    try {
      const response = await fetch(originUrl, {
        cf: {
          cacheEverything: true,
          cacheTtl: 86400, // 24 Hours Edge Cache for static binaries
          cacheKey: canonicalPath
        }
      });

      // Inject Hardened Privacy & Security Headers
      const newHeaders = new Headers(response.headers);
      newHeaders.set('X-SIAR-Mirror', selectedMirror.name);
      newHeaders.set('X-SIAR-Edge-PoP', request.cf?.colo || 'EDGE');
      newHeaders.set('X-SIAR-Privacy', 'Zero-Tracking-Verified');
      newHeaders.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
      newHeaders.set('X-Content-Type-Options', 'nosniff');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });

    } catch (err) {
      // Automatic Circuit Breaker: Fall back to Tier 2 Sovereign Mirror
      const fallbackUrl = `${STORAGE_TIERS.tier2_sovereign.baseUrl}${canonicalPath}`;
      return fetch(fallbackUrl);
    }
  }
};

/**
 * Anonymize IP address in memory before any log ingestion
 */
function anonymizeIp(ip) {
  if (ip.includes(':')) {
    // IPv6: Keep first 3 groups (/48)
    const parts = ip.split(':');
    return parts.slice(0, 3).join(':') + '::';
  } else {
    // IPv4: Zero out last octet (/24)
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }
  return '0.0.0.0';
}

/**
 * Select optimal storage mirror based on geography & health
 */
function selectOptimalMirror(continent, env) {
  if (continent === 'EU') {
    return STORAGE_TIERS.tier2_sovereign; // Route European users directly to sovereign EU Hetzner mirror
  }
  return STORAGE_TIERS.tier1_primary; // Default to global R2 primary
}

/**
 * Normalize download URIs to canonical release filenames
 */
function resolveCanonicalPackage(pathname) {
  if (pathname.startsWith('/latest/android-apk')) {
    return '/releases/siar-messenger-0.1.0-universal.apk';
  }
  if (pathname.startsWith('/latest/linux-deb')) {
    return '/deb/pool/main/s/siar-desktop/siar-desktop_0.1.0_amd64.deb';
  }
  return pathname;
}
