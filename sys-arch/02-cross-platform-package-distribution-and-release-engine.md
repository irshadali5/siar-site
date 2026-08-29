# Part II: Universal Package Distribution & Release Engine

## 1. Overview & Distribution Strategy

The **SIAR Package Distribution Engine** is engineered to deliver native binaries, system services, application bundles, and container images across all supported hardware architectures and operating systems with zero centralized friction.

```
                               +----------------------------------------+
                               |        Git Tag / Release Event         |
                               +----------------------------------------+
                                                   |
                        +--------------------------+-------------------------+
                        |                                                    |
                        v                                                    v
          [ Cross-Compilation Matrix ]                             [ Android NDK Build ]
          - x86_64, aarch64, armv7, riscv64                       - armeabi-v7a, arm64-v8a, x86_64
                        |                                                    |
                        +--------------------------+-------------------------+
                                                   |
                                                   v
                               +----------------------------------------+
                               |     Package Packaging & Signing        |
                               | (Minisign + GPG + Cosign + SLSA L3)    |
                               +----------------------------------------+
                                                   |
       +--------------------+----------------------+--------------------+--------------------+
       |                    |                      |                    |                    |
       v                    v                      v                    v                    v
 [ APT / Debian ]    [ RPM / Fedora ]       [ Arch / AUR ]       [ Alpine / APK ]    [ Homebrew Tap ]
 Packages.gz         repomd.xml             PKGBUILD / DB        APKINDEX.tar.gz     siar.rb Formula
       |                    |                      |                    |                    |
       v                    v                      v                    v                    v
 [ F-Droid Repo ]    [ Flatpak/Flathub ]    [ Windows Winget ]   [ OCI Container ]   [ One-Line Shell ]
 index-v2.json       org.siar.App           manifest.yaml        ghcr.io/siar        install.sh / ps1
```

---

## 2. Target Platforms & Package Matrix

| Platform / Target OS | Hardware Architecture | Distribution Format | Primary Delivery Channel | Update Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Android (Mobile)** | `arm64-v8a`, `armeabi-v7a`, `x86_64` | Signed APK, Signed AAB | Direct Web Download, F-Droid Repo, Play Store | F-Droid Client, In-App Auto-Update |
| **Debian / Ubuntu / Raspberry Pi OS** | `x86_64`, `aarch64`, `armv7l` | `.deb` Package | SIAR Official APT Repository | `apt update && apt upgrade` |
| **Fedora / RHEL / Rocky / OpenSUSE** | `x86_64`, `aarch64` | `.rpm` Package | SIAR Official RPM Repository | `dnf update` / `zypper update` |
| **Arch Linux / Manjaro** | `x86_64`, `aarch64` | PKGBUILD, Binary Pacman DB | AUR (`siar-bin`, `siar-git`), SIAR Pacman Repo | `pacman -Syu` / `yay` / `paru` |
| **Alpine Linux / PostmarketOS** | `x86_64`, `aarch64`, `armv7` | `.apk` Alpine Package | SIAR Alpine Repository | `apk upgrade` |
| **NixOS / Flakes** | Multi-Arch | Nix Package / Flake | `github:irshadali5/siar#siar-cli` | `nix profile upgrade` |
| **macOS (Desktop & Daemon)** | Apple Silicon (`arm64`), Intel (`x86_64`) | Universal `.dmg`, Signed `.pkg` | SIAR Homebrew Cask & Formula, Direct DMG | `brew upgrade siar` |
| **Windows 10/11 (Desktop & CLI)** | `x86_64`, `arm64` | `.msix`, NSIS `.exe`, `.zip` | Winget, Chocolatey, Direct Download | `winget upgrade siar` |
| **Universal Linux Desktop** | `x86_64`, `aarch64` | Flatpak, AppImage | Flathub, SIAR Releases | Flatpak auto-update |
| **Embedded Linux / Routers / Solar Nodes** | `armv7l`, `aarch64`, `mips`, `riscv64` | Standalone static binaries (`musl`), OpenWrt `.ipk` | Direct Tarball, OpenWrt opkg repo | `opkg update && opkg upgrade` |
| **Cloud / Headless Servers** | Multi-Arch (`amd64`, `arm64`, `riscv64`)| OCI Container Image | `ghcr.io/irshadali5/siar`, Docker Hub | Docker compose / Watchtower |
| **Rust / Developer Toolchain** | All Cargo Supported | Cargo Crates, `cargo-binstall` | Crates.io, GitHub Releases | `cargo binstall siar-cli` |

---

## 3. Package Manifest Specifications & Recipes

### 3.1 Arch Linux AUR Specification (`PKGBUILD`)

```bash
# Maintainer: Irshad Ali <dev@siar.irshad.org.in>
pkgname=siar-bin
pkgver=0.1.0
pkgrel=1
pkgdesc="Survivable Identity & Autonomous Routing - Decentralized Mesh Daemon"
arch=('x86_64' 'aarch64')
url="https://siar.irshad.org.in"
license=('MIT' 'Apache-2.0')
depends=('glibc')
provides=('siar-cli' 'siar-emergency-node')
conflicts=('siar-git')
source_x86_64=("https://pkg.siar.irshad.org.in/releases/siar-v${pkgver}-x86_64-unknown-linux-musl.tar.gz")
source_aarch64=("https://pkg.siar.irshad.org.in/releases/siar-v${pkgver}-aarch64-unknown-linux-musl.tar.gz")
sha256sums_x86_64=('d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35')
sha256sums_aarch64=('8a901f4c2810a9918b9b5d03019c07d8b6c51f90da3a666eec13ab35d4735e3a')

package() {
    install -Dm755 "${srcdir}/siar-cli" "${pkgdir}/usr/bin/siar"
    install -Dm755 "${srcdir}/siar-emergency-node" "${pkgdir}/usr/bin/siar-emergency-node"
    install -Dm644 "${srcdir}/siar-emergency-node.service" "${pkgdir}/usr/lib/systemd/system/siar-emergency-node.service"
}
```

### 3.2 Alpine Linux Package Recipe (`APKBUILD`)

```bash
# Contributor: Irshad Ali <dev@siar.irshad.org.in>
# Maintainer: Irshad Ali <dev@siar.irshad.org.in>
pkgname=siar
pkgver=0.1.0
pkgrel=0
pkgdesc="Zero-infrastructure decentralized mesh & DTN messaging daemon"
url="https://siar.irshad.org.in"
arch="x86_64 aarch64 armv7"
license="MIT OR Apache-2.0"
makedepends="cargo rust"
source="siar-$pkgver.tar.gz::https://github.com/irshadali5/siar/archive/refs/tags/v$pkgver.tar.gz"

build() {
    cargo build --release --locked -p siar-cli -p siar-emergency-node
}

package() {
    install -Dm755 target/release/siar-cli "$pkgdir"/usr/bin/siar
    install -Dm755 target/release/siar-emergency-node "$pkgdir"/usr/bin/siar-emergency-node
}
```

### 3.3 Nix Flake Specification (`flake.nix`)

```nix
{
  description = "SIAR: Survivable Identity & Autonomous Routing";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        packages.default = pkgs.rustPlatform.buildRustPackage {
          pname = "siar";
          version = "0.1.0";
          src = ./.;
          cargoLock.lockFile = ./Cargo.lock;
          meta = with pkgs.lib; {
            description = "Zero-infrastructure, multi-transport DTN mesh daemon";
            homepage = "https://siar.irshad.org.in";
            license = licenses.mit;
          };
        };
      }
    );
}
```

### 3.4 Windows Winget Manifest (`siar.winget.yaml`)

```yaml
PackageIdentifier: IrshadAli.SIAR
PackageVersion: 0.1.0
PackageName: SIAR Messenger
Publisher: SIAR Open Source Project
License: MIT
ShortDescription: Zero-infrastructure, offline-first decentralized messaging platform.
Moniker: siar
Tags:
  - mesh
  - p2p
  - dtn
  - privacy
Installers:
  - Architecture: x64
    InstallerType: nullsoft
    InstallerUrl: https://pkg.siar.irshad.org.in/releases/SIAR-Setup-0.1.0-x64.exe
    InstallerSha256: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a
ManifestType: singleton
ManifestVersion: 1.6.0
```

---

## 4. Multi-Arch OCI Container Image Architecture

SIAR distributes hardened, minimal container images for headless cloud servers and edge gateways:

```dockerfile
# Multi-Arch Hardened Container: ghcr.io/irshadali5/siar:latest
FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY siar-emergency-node /usr/local/bin/siar-emergency-node

USER 10001:10001
VOLUME ["/var/lib/siar"]
EXPOSE 9443 8080

ENTRYPOINT ["/usr/local/bin/siar-emergency-node"]
CMD ["--config", "/var/lib/siar/config.toml"]
```

---

## 5. Bandwidth Throttling & CDN Stampede Protection

To handle sudden traffic surges during disaster news broadcasts:
1. **Dynamic Edge Caching**: Releases are cached at Cloudflare edge POPs with `Cache-Control: public, max-age=31536000, immutable`.
2. **BitTorrent Web Seeding**: Automatic fallback to community BitTorrent swarms if edge bandwidth quotas exceed thresholds.
3. **Range Requests**: Full HTTP `206 Partial Content` support for resuming interrupted multi-megabyte package downloads on unstable cellular connections.
