# Part VII: Global Edge CDN, Storage & Routing Topology

## 1. Overview & High-Availability Mandate

The SIAR web and package distribution platform is architected for **zero single points of failure**, resilience against nation-state DDoS attacks, and low-latency global delivery without tracking user identities.

```
                                  [ Anycast DNS: siar.irshad.org.in ]
                                                |
                 +------------------------------+------------------------------+
                 |                                                             |
                 v                                                             v
       [ North America Edge ]                                        [ Europe & Asia Edge ]
       Cloudflare / Fastly PoPs                                      Cloudflare / Fastly PoPs
                 |                                                             |
                 +------------------------------+------------------------------+
                                                |
                                  [ Geo-Routing & Fallback Engine ]
                                                |
         +---------------------+----------------+---------------------+
         |                     |                                      |
         v                     v                                      v
 [ Primary Object Store ]  [ European Bare-Metal Mirror ]  [ APAC / Failover S3 ]
 Cloudflare R2             MinIO Cluster (Hetzner / OVH)  Backblaze B2 / AWS S3
 (Zero Egress Costs)       (Independent Sovereign Node)   (Tertiary Disaster Backup)
```

---

## 2. Multi-Region Storage & Synchronization Topology

### 2.1 Storage Tier Architecture

| Storage Tier | Provider / Technology | Geographic Location | Role & Retention |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Primary Origin)** | Cloudflare R2 | Global Multi-Region | High-speed, zero-egress CDN origin for all web assets, `.deb`, `.rpm`, `.apk`. |
| **Tier 2 (Sovereign Mirror)** | MinIO Distributed Cluster | Germany & Finland (Hetzner) | Fully autonomous bare-metal backup origin outside US hyper-scaler jurisdiction. |
| **Tier 3 (Cold Archive)** | Backblaze B2 / AWS S3 | US-West & Asia-East | Immutable, object-locked (WORM) archival tier for historical release provenance. |

### 2.2 Automated Cross-Region Synchronization

Release artifacts published to Tier 1 are replicated in real time across Tier 2 and Tier 3 using cryptographically authenticated worker daemons:

```
[ Release CI Workflow ] ---> (Atomic S3 Put to Primary R2)
                                      |
                         +------------+------------+
                         |                         |
                         v                         v
           (Sync to MinIO EU Sovereign)   (Sync to Backblaze B2 Cold)
```

---

## 3. Intelligent Geo-Routing & Automated Mirror Failover

```typescript
// Edge Compute Download Router (Cloudflare Worker / Fastly Compute)
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const country = request.cf?.country || 'US';
    const continent = request.cf?.continent || 'NA';

    // 1. Resolve Target Package Path
    const canonicalPath = resolveCanonicalPackage(url.pathname);

    // 2. Select Healthy Origin based on Proximity & Latency
    const selectedMirror = await selectBestHealthyMirror(continent, env);

    // 3. Stream Response directly or issue HTTP 302 Redirect
    const originUrl = `${selectedMirror.baseUrl}${canonicalPath}`;
    return fetch(originUrl, {
      cf: {
        cacheEverything: true,
        cacheTtl: 86400, // Cache static packages for 24h
      }
    });
  }
};
```

### 3.1 Automated Health Checking & Circuit Breakers
- Edge workers execute automated background health probes every 60 seconds against all mirror endpoints.
- If a mirror fails 3 consecutive HTTP health probes (`/healthz` or hash mismatch on canary test files), it is instantly drained from the active routing pool.

---

## 4. Privacy & Zero-Tracking Architecture

```
+-----------------------------------------------------------------------------------+
|                        SIAR PRIVACY-PRESERVING TELEMETRY                          |
+-----------------------------------------------------------------------------------+
| 1. ZERO TRACKING COOKIES     | No tracking scripts, analytics cookies, or pixels.  |
| 2. IP MASKING & REDACTION    | Client IP addresses truncated to /24 (IPv4) or     |
|                              | /48 (IPv6) in edge memory before metric ingestion.  |
| 3. NO THIRD-PARTY DEPENDENCY | All fonts, scripts, and assets are strictly self-  |
|                              | hosted on the SIAR domain.                          |
| 4. ENCRYPTED DNS (DoH/DoT)   | Authoritative DNSSEC + DoH endpoints enabled.      |
+-----------------------------------------------------------------------------------+
```

### 4.1 NGINX / Edge Privacy Redaction Configuration

```nginx
# Edge NGINX IP Anonymization Rule
map $remote_addr $remote_addr_anonymized {
    ~(?P<ip>\d+\.\d+\.\d+)\.\d+    $ip.0;
    ~(?P<ip>[^:]+:[^:]+:[^:]+):    $ip::;
    default                         0.0.0.0;
}

log_format privacy_combined '$remote_addr_anonymized - $remote_user [$time_local] '
                            '"$request" $status $body_bytes_sent '
                            '"$http_referer" "-"';
```
