# Part VIII: Offline Distribution, Torrent & Emergency Captive Portal

## 1. Overview & The Off-Grid Distribution Paradox

A major architectural vulnerability of traditional emergency communication tools is their **dependency on centralized internet infrastructure to download the initial software**. If an earthquake, hurricane, or government internet blackout occurs before citizens have installed the app, cloud-only app stores (Google Play, Apple App Store) become completely inaccessible.

```
       +-------------------------------------------------------------------+
       |                 THE SIAR SURVIVABLE DISTRIBUTION PARADOX          |
       +-------------------------------------------------------------------+
       | Problem: How do users get SIAR when the Internet is ALREADY down? |
       |                                                                   |
       | Solution: 1. Local Wi-Fi Captive Portal on Emergency Repeaters    |
       |           2. Self-Contained "Survival Archive" (.tar.zst)         |
       |           3. BitTorrent Swarms with Permanent Web Seeds           |
       |           4. Iroh P2P Content-Addressed Blob Sync                 |
       |           5. USB Sneaker-Net Field Provisioning Kits              |
       +-------------------------------------------------------------------+
```

---

## 2. Local Wi-Fi Emergency Captive Portal Engine

Every headless repeater running `siar-emergency-node` includes an embedded, zero-dependency HTTP server that broadcasts an open Wi-Fi Access Point (SSID: `SIAR-Emergency-Node-XXXX`):

```
                                [ Disconnected Android Phone ]
                                              |
                              (Connects to Local Wi-Fi AP)
                                              v
                             [ Captive Portal Auto-Trigger ]
                                              |
                   +--------------------------+--------------------------+
                   |                                                     |
                   v                                                     v
   [ 📥 1-Click Install APK ]                            [ 🚨 Local Emergency SOS ]
   Direct high-speed HTTP transfer                       Send mesh distress alert directly
   from node's local flash storage                       via browser without installing app!
```

### 2.1 Captive Portal & DNS Interception Configuration (`dnsmasq.conf`)

To intercept all captive portal detection probes across Android, iOS, macOS, and Windows:

```ini
# /etc/dnsmasq.d/siar-captive-portal.conf
interface=wlan0
dhcp-range=192.168.4.10,192.168.4.250,255.255.255.0,1h
address=/#/192.168.4.1
dhcp-option=3,192.168.4.1
dhcp-option=6,192.168.4.1
```

```rust
// Embedded Lightweight Captive Portal Server inside crates/siar-emergency
pub struct CaptivePortalServer {
    bind_addr: SocketAddr,
    local_apk_path: PathBuf,
    local_docs_path: PathBuf,
}

impl CaptivePortalServer {
    pub async fn handle_request(&self, req: Request<Body>) -> Response<Body> {
        let path = req.uri().path();

        // Intercept standard Android / iOS / Windows Captive Portal Probes
        if path == "/generate_204" || path == "/hotspot-detect.html" || path == "/ncsi.txt" {
            return Response::builder()
                .status(StatusCode::FOUND)
                .header("Location", "http://192.168.4.1/portal.html")
                .body(Body::empty())
                .unwrap();
        }

        match path {
            "/portal.html" | "/" => serve_embedded_html(PORTAL_HTML),
            "/download/siar-messenger.apk" => serve_file(&self.local_apk_path).await,
            "/api/mesh/status" => serve_json_status().await,
            _ => serve_embedded_html(PORTAL_HTML),
        }
    }
}
```

---

## 3. Self-Contained "Full Offline Survival Pack"

```
siar-survival-pack-v0.1.0/
├── bin/
│   ├── android/
│   │   ├── siar-messenger-universal.apk
│   │   └── siar-messenger-arm64.apk
│   ├── linux/
│   │   ├── siar-desktop-x86_64.AppImage
│   │   ├── siar-cli-x86_64
│   │   └── siar-emergency-node-aarch64 (for Raspberry Pi)
│   ├── macos/
│   │   └── SIAR-Messenger.dmg
│   └── windows/
│       └── SIAR-Setup.exe
├── docs/
│   ├── book/ (Complete offline searchable documentation)
│   ├── wiki/ (Complete protocol specifications & repair guides)
│   └── quickstart-emergency.pdf (Printable laminated field cards)
├── security/
│   ├── siar-root-release.pub (Minisign & GPG keys)
│   └── verify-offline.sh (Standalone air-gapped verification script)
└── serve-local.sh (1-click script to start local distribution web server)
```

---

## 4. BitTorrent Swarm & Iroh P2P Blob Distribution

```
[ Git Release ] ---> [ Create Multi-File .torrent & Magnet Link ]
                                     |
                +--------------------+--------------------+
                |                                         |
                v                                         v
   [ Official High-Bandwidth ]               [ Community Seeder Swarm ]
      Web Seed (HTTP/QUIC)                   (Decentralized Seeders)
```

### 4.1 Official Release Magnet URI Schema
```
magnet:?xt=urn:btih:7f9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a
&dn=SIAR_Release_v0.1.0_All_Platforms
&ws=https://pkg.siar.irshad.org.in/releases/
&tr=udp://tracker.opentrackr.org:1337/announce
&tr=udp://tracker.openbittorrent.com:6969/announce
```

### 4.2 Iroh P2P Content-Addressed Blob Sharing
```bash
# Download official SIAR release blob directly over Iroh P2P
iroh blob get blob:bafkr4ihdwdcefgh4dqkjv67... --out ./siar-release.tar.gz
```
