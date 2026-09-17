# SIAR System Architecture & Technical Wiki

> **SIAR**: Secure, Interoperable, Autonomous & Resilient Peer-to-Peer Communication Platform.  
> Built in Rust for mobile, desktop, headless daemons, embedded Linux nodes, and anonymous network cloud relays.

Welcome to the **SIAR System Architecture Wiki**. This knowledge portal contains **176 comprehensive technical specifications** totaling **514,448 lines** and **875,254 words**, covering every engineering layer from low-level Postcard framing and OpenMLS multi-device cryptography to delay-tolerant bundle forwarding, pure-Rust audio DSP, cross-platform Dioxus/Compose shells, global Loopix mixnets, zero-trust measured boot, and sandboxed WASM extensions.

---

## 📚 Essential Architecture Companions

Before exploring individual specifications, engineers and operators should consult the master synthesis documents:

- **[System Architecture Design Rationale](design-rationale.md)**: The authoritative engineering synthesis detailing the 3 Tiers, the 8 Anonymous Network layers, database architecture (PostgreSQL vs. sovereign pure-Rust stack), threat models, and trade-off rationales.
- **[System Capabilities & Comparison Matrix](system-capabilities-comparison.md)**: Rigorous technical comparison between SIAR, Signal, Briar, Matrix, Reticulum, Tor, and Session across 12 capability dimensions.
- **[Master Specification Execution Order & Dependency Matrix](spec-order.md)**: The 7-milestone execution sequencing resolving inverted security and UI dependencies.

---

## 🏛️ Corpus Architecture: The 3 Tiers

```text
sys-arch/ (176 Specifications · 514,448 lines · 875,254 words)
│
├── Tier 1: Core Mesh & Local-First Engine (Parts 01 – 33)
│   105,732 lines · 33 Specifications
│   Focus: P2P wire framing, multi-device MLS keys, dynamic routing policy,
│   resumable BLAKE3 blobs, DTN data mules, emergency QoS, lock-free audio DSP.
│
├── Tier 2: UI/UX & Cross-Platform Shells (Parts UI/UX 01 – 27)
│   72,610 lines · 27 Specifications
│   Focus: Desktop Dioxus 0.7 shells, Android Jetpack Compose shells, design tokens,
│   virtualized timelines, composer, call surfaces, out-of-band pairing, security center.
│
└── Tier 3: The Anonymous Network & Cloud Operating Ecosystem (Parts 34 – 150)
    336,106 lines · 116 Specifications (Parts 34–138, 140–150; 139 reserved)
    Focus: Global Loopix mixnet, Sphinx onion packetization, zero-trust cloud servers,
    TPM measured boot, physical datacenter tamper detection, PIR search, WASM sandboxes.
```

---

## ⚡ Complete Specification Matrix (18 Parts)

| Part | Title | Range | Key Systems Engineered |
| :--- | :--- | :--- | :--- |
| **I** | **Protocol Foundation & Extensions** | Specs [01](01-protocol-extension-system-architecture.md), [07](07-capability-negotiation-architecture.md), [21](21-third-party-protocol-extensions-architecture.md)–[24](24-plugin-module-ecosystem-architecture.md) | Wire codecs, envelope framing, capability negotiation, WASM plugin ABI |
| **II** | **Identity, Trust & Cryptography** | Specs [02](02-multi-device-identity-architecture.md), [28](28-production-security-e2ee-key-management-privacy-architecture.md) | Multi-device key trees, OpenMLS ratchet, identity root keys, forward secrecy |
| **III** | **Mesh Networking & Transports** | Specs [03](03-transport-routing-policy-engine-architecture.md), [11](11-relay-self-hosted-infrastructure-architecture.md)–[15](15-qr-nfc-bootstrap-pairing-architecture.md) | Dynamic routing, Iroh QUIC, multipath bonding, BLE/NAN/LoRa, QR/NFC bootstrap |
| **IV** | **DTN & Emergency Mesh** | Specs [06](06-dtn-store-carry-forward-architecture.md), [17](17-emergency-priority-classes-architecture.md) | Delay-tolerant bundle store-carry-forward, epidemic routing, SOS alerts |
| **V** | **Storage, Outbox & Lifecycle** | Specs [04](04-offline-event-log-architecture.md), [05](05-robust-file-blob-subsystem-architecture.md), [09](09-crash-recovery-architecture.md), [32](32-search-indexing-local-knowledge-privacy-architecture.md), [33](33-backup-restore-export-import-archival-portability-architecture.md) | Append-only outbox, BLAKE3 Merkle-DAG blobs, crash recovery, Tantivy FTS, vault export |
| **VI** | **Realtime Media & Audio DSP** | Specs [25](25-android-direct-hardware-surface-zero-copy-media-architecture.md), [26](26-rust-first-audio-dsp-resampling-aec-ns-agc-architecture.md), [29](29-realtime-calls-media-session-protocol-architecture.md) | Zero-copy video surfaces, pure-Rust audio DSP (AEC, NS, AGC), call signaling |
| **VII** | **Presence & Notifications** | Specs [30](30-presence-availability-typing-read-receipts-ephemeral-state-architecture.md), [31](31-notifications-push-background-delivery-lifecycle-architecture.md) | Ephemeral availability, typing state, read receipts, unified push wake |
| **VIII** | **Native Daemons & FFI** | Specs [16](16-daemon-headless-runtime-architecture.md), [19](19-c-abi-ffi-architecture.md), [20](20-embedded-linux-node-architecture.md), [27](27-rust-driven-android-native-build-packaging-automation.md) | Headless daemon runtime, C-ABI FFI bindings, OpenWrt/embedded nodes, Android packaging |
| **IX** | **Reliability, Testing & Fuzzing** | Specs [08](08-resource-limits-backpressure-architecture.md), [10](10-fuzzing-protocol-test-suite-architecture.md), [18](18-network-diagnostics-path-visualization-architecture.md) | Memory quotas, backpressure, AFL++/libFuzzer harnesses, live path visualization |
| **X** | **UI/UX Client Architecture** | Specs [UI/UX 01](ui-ux-01-product-foundation-cross-platform-interaction-architecture.md)–[27](ui-ux-27-ui-testing-screenshot-interaction-release-quality-gates-architecture.md) | Desktop Dioxus, Android Jetpack Compose, tokens, timeline, contacts, security center |
| **XI** | **Mixnet Mechanics** | Specs [34](34-mixnet-loopix-sphinx-nym-high-anonymity-transport-architecture.md)–[42](42-anonymous-network-relay-economics-proof-of-bandwidth-anti-collusion-staking-node-selection-decentralized-resource-accounting-architecture.md) | Loopix Poisson delays, Sphinx packetization, cover traffic, directory consensus |
| **XII** | **Anonymous App Primitives** | Specs [43](43-anonymous-network-end-to-end-latency-bound-deadline-scheduling-interactive-session-optimization-priority-multiplexing-architecture.md)–[49](49-anonymous-network-blind-reputation-sybil-resistant-rate-limiting-zero-knowledge-proof-tokens-abuse-prevention-architecture.md) | Private group fanout, anonymous VoIP signaling, blind reputation & ZK tokens |
| **XIII** | **Sovereign Policies & Boundary** | Specs [50](50-anonymous-network-adversarial-defense-traffic-analysis-mitigation-passive-active-adversary-resistance-formal-security-bounds-architecture.md)–[70](70-anonymous-network-disaster-exercises-business-continuity-validation-crisis-coordination-operational-resilience-governance-architecture.md) | Data sovereignty, anti-enumeration naming, panic kill switch, legal boundaries |
| **XIV** | **Zero-Trust Infrastructure** | Specs [71](71-anonymous-network-trustworthy-boot-host-attestation-runtime-integrity-binary-measurement-compromise-detection-architecture.md)–[81](81-anonymous-network-authorization-policy-decision-enforcement-capability-evaluation-abac-rbac-distributed-access-control-architecture.md) | TPM measured boot, HSM key custody, reproducible SBOM, Raft consensus, mTLS |
| **XV** | **Private Cloud Services** | Specs [82](82-anonymous-network-identity-provider-authentication-mfa-passkeys-session-management-account-security-architecture.md)–[94](94-anonymous-network-audit-transparency-user-visible-security-history-verifiable-actions-privacy-preserving-accountability-architecture.md) | Passkey auth, private contact graph, PIR search, differential privacy metrics |
| **XVI** | **Defense & SecOps** | Specs [95](95-anonymous-network-policy-compliance-engine-continuous-control-evaluation-security-posture-evidence-collection-privacy-preserving-assurance-architecture.md)–[100](100-anonymous-network-disaster-recovery-backup-integrity-restore-orchestration-regional-failover-continuity-validation-privacy-preserving-resilience-architecture.md) | Continuous compliance, incident containment, threat hunting, disaster failover |
| **XVII** | **SRE & Physical Reliability** | Specs [101](101-anonymous-network-capacity-management-load-shedding-admission-control-autoscaling-resource-fairness-privacy-preserving-availability-architecture.md)–[121](121-anonymous-network-reliability-risk-register-technical-debt-governance-systemic-weakness-tracking-remediation-portfolio-privacy-preserving-engineering-risk-architecture.md) | Adaptive load-shedding, FinOps, SLOs, facility environmental & physical tamper security |
| **XVIII** | **Governance & Extension Ecosystem**| Specs [122](122-anonymous-network-architecture-governance-technical-standards-adr-lifecycle-design-review-exception-management-privacy-preserving-engineering-decision-architecture.md)–[150](150-anonymous-network-extension-developer-relations-publisher-support-documentation-governance-compatibility-communication-migration-guidance-ecosystem-education-privacy-preserving-developer-success-architecture.md) | Requirements knowledge graph, developer CLI, sandboxed WASM plugins, marketplace |

---

## 🎯 Role-Based Reading Paths

### 🛡️ 1. Cryptography & Security Architects
1. [02 — Multi-Device Identity & Trust Model](02-multi-device-identity-architecture.md)
2. [28 — Production Security, E2EE, Key Management & Privacy](28-production-security-e2ee-key-management-privacy-architecture.md)
3. [15 — Out-of-Band QR & NFC Bootstrap Pairing](15-qr-nfc-bootstrap-pairing-architecture.md)
4. [34 — Loopix Mixnet & Sphinx Onion Packetization](34-mixnet-loopix-sphinx-nym-high-anonymity-transport-architecture.md)
5. [39 — Cryptographic Agility & Hybrid PQ-KEM Layering](39-anonymous-network-cryptographic-agility-hybrid-pq-kem-layering-sphinx-key-ratchet-compromise-containment-architecture.md)
6. [71 — Trustworthy Boot, Attestation & Binary Measurement](71-anonymous-network-trustworthy-boot-host-attestation-runtime-integrity-binary-measurement-compromise-detection-architecture.md)
7. [72 — Hardware Security Modules (HSM) & Key Custody](72-anonymous-network-hardware-security-modules-secure-elements-key-custody-signing-ceremonies-high-assurance-cryptographic-operations-architecture.md)
8. [UI/UX 15 — Security Center, Devices, Keys & Recovery](ui-ux-15-security-center-devices-keys-recovery-architecture.md)

### 📡 2. Mesh Networking & Protocol Engineers
1. [01 — Protocol Extension System Architecture](01-protocol-extension-system-architecture.md)
2. [03 — Transport & Routing Policy Engine](03-transport-routing-policy-engine-architecture.md)
3. [06 — DTN Store-Carry-Forward & Bundle Forwarding](06-dtn-store-carry-forward-architecture.md)
4. [12 — Multipath Networking & Link Aggregation](12-multipath-networking-architecture.md)
5. [14 — Proximity Abstraction (BLE, Wi-Fi Direct, LoRa)](14-proximity-abstraction-architecture.md)
6. [17 — Emergency Priority Classes & Critical Alert Mesh](17-emergency-priority-classes-architecture.md)
7. [36 — Cover Traffic, Heartbeat Loops & Obfuscation](36-anonymous-network-cover-traffic-heartbeat-loops-drop-traps-traffic-shape-obfuscation-architecture.md)
8. [41 — Routing Failure Modes & Fault Tolerance](41-anonymous-network-routing-failure-modes-black-hole-detection-circuit-degradation-reroute-negotiation-fault-tolerance-architecture.md)

### 💾 3. Storage, Database & Sync Engineers
1. [04 — Offline Event Log & Sync Engine](04-offline-event-log-architecture.md)
2. [05 — Robust File & Blob Subsystem](05-robust-file-blob-subsystem-architecture.md)
3. [09 — Crash Recovery & State Integrity](09-crash-recovery-architecture.md)
4. [32 — Search, Indexing & Local Privacy Retrieval](32-search-indexing-local-knowledge-privacy-architecture.md)
5. [33 — Backup, Restore, Export & Long-Term Archival](33-backup-restore-export-import-archival-portability-architecture.md)
6. [74 — Database Persistent State & Storage Engines](74-anonymous-network-database-persistent-state-transaction-boundaries-schema-evolution-storage-engine-architecture.md)
7. [67 — Storage Minimization & Cryptographic Erasure](67-anonymous-network-data-lifecycle-storage-minimization-secure-deletion-retention-archival-cryptographic-erasure-architecture.md)

### 📞 4. Realtime Media & Audio DSP Engineers
1. [29 — Realtime Calls & Media Session Protocol](29-realtime-calls-media-session-protocol-architecture.md)
2. [26 — Rust-First Audio DSP (AEC, NS, AGC, Resampling)](26-rust-first-audio-dsp-resampling-aec-ns-agc-architecture.md)
3. [25 — Android Direct Surface Zero-Copy Media](25-android-direct-hardware-surface-zero-copy-media-architecture.md)
4. [45 — Anonymous Ephemeral Voice/Video Signaling](45-anonymous-network-anonymous-ephemeral-voice-video-media-signaling-jitter-obfuscation-realtime-flow-privacy-architecture.md)
5. [UI/UX 07 — Calls & Realtime Media UX](ui-ux-07-calls-realtime-media-architecture.md)

### 📱 5. UI/UX & Frontend Engineers (Desktop / Mobile)
1. [UI/UX 01 — Product UX Foundation & Cross-Platform Interaction](ui-ux-01-product-foundation-cross-platform-interaction-architecture.md)
2. [UI/UX 02 — Desktop Dioxus App Shell & Navigation](ui-ux-02-desktop-dioxus-app-shell-navigation-window-architecture.md)
3. [UI/UX 03 — Android Jetpack Compose App Shell & Lifecycle](ui-ux-03-android-jetpack-compose-app-shell-navigation-lifecycle-architecture.md)
4. [UI/UX 05 — Conversation Message Timeline UX](ui-ux-05-conversation-message-timeline-architecture.md)
5. [UI/UX 06 — Message Composer, Attachments & Voice Notes](ui-ux-06-message-composer-attachments-voice-notes-drafts-architecture.md)
6. [UI/UX 22 — Design System, Tokens, Typography & Motion](ui-ux-22-design-system-tokens-typography-icons-motion-architecture.md)
7. [UI/UX 23 — Responsive & Adaptive Layouts](ui-ux-23-responsive-adaptive-desktop-tablet-foldable-phone-layout-architecture.md)

### ☁️ 6. Cloud, SRE & Operations Engineers
1. [62 — Deployment, Packaging & Reproducible Operations](62-anonymous-network-deployment-packaging-infrastructure-provisioning-bare-metal-vm-container-runtime-reproducible-operations-architecture.md)
2. [76 — Distributed Consensus & State Coordination](76-anonymous-network-distributed-consensus-leader-election-membership-quorum-state-coordination-architecture.md)
3. [78 — Edge Gateway, Reverse Proxy & WAF](78-anonymous-network-edge-gateway-ingress-egress-reverse-proxy-api-gateway-waf-boundary-enforcement-architecture.md)
4. [101 — Capacity Management & Admission Control](101-anonymous-network-capacity-management-load-shedding-admission-control-autoscaling-resource-fairness-privacy-preserving-availability-architecture.md)
5. [109 — Service Level Objectives & Error Budgets](109-anonymous-network-service-level-objectives-error-budgets-reliability-policy-availability-governance-privacy-preserving-reliability-engineering-architecture.md)
6. [117 — Physical Datacenter Tamper Detection & Security](117-anonymous-network-physical-security-tamper-detection-site-access-control-chain-of-custody-asset-protection-privacy-preserving-facility-security-architecture.md)
7. [120 — Post-Incident Review & Root-Cause Analysis](120-anonymous-network-post-incident-review-root-cause-analysis-corrective-actions-organizational-learning-recurrence-prevention-privacy-preserving-reliability-improvement-architecture.md)
