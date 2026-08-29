# Part IX: Release Automation & CI/CD Cross-Compilation Pipeline

## 1. Overview & Automation Philosophy

The **SIAR Release Automation Engine** is designed to transform a signed Git release tag into verified, signed, and cross-compiled packages across 10+ target platforms within minutes, while maintaining **100% reproducible builds and zero human intervention in production signing keys**.

```
+-----------------------------------------------------------------------------------+
|                        SIAR RELEASE AUTOMATION PIPELINE                           |
+-----------------------------------------------------------------------------------+
|  [1. Tag Push] --> [2. Quality Gates] --> [3. Multi-Arch Matrix Build]            |
|                                                     |                             |
|  [6. CDN Purge] <-- [5. Repo Index Sync] <-- [4. Cryptographic Attestation]       |
+-----------------------------------------------------------------------------------+
```

---

## 2. CI/CD Cross-Compilation Matrix

```mermaid
graph TD
    Trigger["Git Tag: refs/tags/v*.*.* (GPG Signed)"]

    subgraph Quality Gates
        RustTests["cargo test --all-targets"]
        ClippyCheck["cargo clippy -- -D warnings"]
        DenyAudit["cargo-deny (Licenses & Vulnerabilities)"]
        FuzzSmoke["cargo-fuzz smoke test (10k iterations)"]
    end

    subgraph Parallel Build Matrix
        LinuxX86["Linux x86_64 (GNU & Musl via cargo-zigbuild)"]
        LinuxARM["Linux ARM64 & ARMv7 (Musl static)"]
        LinuxRISCV["Linux RISC-V 64 (Embedded)"]
        MacOS["macOS Universal (Apple Silicon + Intel)"]
        Windows["Windows x64 / ARM64 (MSVC)"]
        AndroidNDK["Android APK & AAB (cargo-ndk + Gradle)"]
        WasmPack["WASM Web Core (wasm32-unknown-unknown)"]
    end

    subgraph Package Generation & Signing
        DebRpm["Generate .deb, .rpm, .apk packages"]
        SignCrypto["Minisign + GPG + Cosign Signing"]
        SLSAGen["Generate SLSA L3 Provenance"]
        FdroidUpdate["fdroidserver update --create-metadata"]
    end

    subgraph Deployment & Ingestion
        R2Sync["Sync to Multi-Region R2 & MinIO S3"]
        GhRelease["Publish to GitHub Releases"]
        CDNPurge["Atomic Edge Cache Invalidation"]
    end

    Trigger --> Quality Gates
    Quality Gates --> Parallel Build Matrix
    Parallel Build Matrix --> Package Generation & Signing
    Package Generation & Signing --> Deployment & Ingestion
```

---

## 3. GitHub Actions Release Workflow Specification

```yaml
# .github/workflows/release.yml
name: SIAR Universal Multi-Arch Release Engine

on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'

permissions:
  contents: write
  id-token: write # Required for SLSA Provenance and Sigstore Keyless Signing

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo test --all-targets --workspace
      - run: cargo clippy --workspace -- -D warnings
      - run: cargo install cargo-deny && cargo deny check

  build-linux-musl:
    needs: quality-gate
    runs-on: ubuntu-latest
    strategy:
      matrix:
        target:
          - x86_64-unknown-linux-musl
          - aarch64-unknown-linux-musl
          - armv7-unknown-linux-musleabihf
          - riscv64gc-unknown-linux-gnu
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.target }}
      - run: pip install cargo-zigbuild
      - run: cargo zigbuild --target ${{ matrix.target }} --release -p siar-cli -p siar-emergency-node
      - uses: actions/upload-artifact@v4
        with:
          name: binaries-${{ matrix.target }}
          path: target/${{ matrix.target }}/release/siar*

  build-android:
    needs: quality-gate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - uses: dtolnay/rust-toolchain@stable
        with:
          targets: aarch64-linux-android, armv7-linux-androideabi, x86_64-linux-android
      - run: cargo install cargo-ndk
      - run: bash scripts/build-android-release.sh
```

---

## 4. Automated Repository Index Generation

```bash
# APT Debian Repository Regeneration
reprepro -b /repo/deb includedeb stable dist/packages/*.deb
gpg --detach-sign --armor -o /repo/deb/dists/stable/Release.gpg /repo/deb/dists/stable/Release
gpg --clear-sign -o /repo/deb/dists/stable/InRelease /repo/deb/dists/stable/Release

# RPM Fedora Repository Regeneration
createrepo_c /repo/rpm/x86_64/
gpg --detach-sign --armor /repo/rpm/x86_64/repodata/repomd.xml

# F-Droid Android Repository Sync
fdroid update --create-metadata --pretty
fdroid signindex
```

---

## 5. Atomic Edge CDN Invalidation & Verification

1. **Staged Upload**: All new packages and indices are uploaded to a versioned staging prefix (`/releases/v0.1.0/`).
2. **Atomic Manifest Update**: The global `manifest.json` and package pointers are updated simultaneously in Cloudflare R2.
3. **Instant Cache Purge**: The CI pipeline issues an automated purge request to Cloudflare Edge.
4. **Automated Smoke Test**: The CI runner executes `curl -fsSL https://siar.irshad.org.in/install.sh | sh --test` against live CDN edge nodes before releasing announcement dispatches.
