/**
 * SIAR CI/CD Release Pipeline & Build Matrix Engine
 * Architecture: Part 09 - Release Automation & CI/CD Pipeline
 * Domain: siar.irshad.org.in
 */

const MATRIX_RECIPES = {
  linux_x86_64: {
    name: "Linux x86_64 (Static Musl)",
    target: "x86_64-unknown-linux-musl",
    compiler: "cargo-zigbuild 0.18 + rustc 1.80",
    cmd: "cargo zigbuild --target x86_64-unknown-linux-musl --release -p siar-cli -p siar-emergency-node",
    output: "target/x86_64-unknown-linux-musl/release/siar-cli (7.8 MB, statically linked, 0 glibc deps)"
  },
  linux_arm64: {
    name: "Linux ARM64 / AArch64 (Static Musl)",
    target: "aarch64-unknown-linux-musl",
    compiler: "cargo-zigbuild 0.18 + rustc 1.80",
    cmd: "cargo zigbuild --target aarch64-unknown-linux-musl --release -p siar-cli -p siar-emergency-node",
    output: "target/aarch64-unknown-linux-musl/release/siar-cli (7.4 MB, for Raspberry Pi 4/5 & AWS Graviton)"
  },
  linux_riscv: {
    name: "Linux RISC-V 64 (Embedded)",
    target: "riscv64gc-unknown-linux-gnu",
    compiler: "cross-rs + rustc 1.80",
    cmd: "cross build --target riscv64gc-unknown-linux-gnu --release -p siar-cli",
    output: "target/riscv64gc-unknown-linux-gnu/release/siar-cli (8.1 MB, Milk-V / VisionFive)"
  },
  macos_universal: {
    name: "macOS Universal (Apple Silicon & Intel)",
    target: "universal2-apple-darwin",
    compiler: "lipo + cargo + macOS SDK 14.4",
    cmd: "cargo build --target aarch64-apple-darwin --release && cargo build --target x86_64-apple-darwin --release && lipo -create -output SIAR_Messenger",
    output: "target/universal2-apple-darwin/release/SIAR_Messenger.app (Apple Notarized)"
  },
  windows_x64: {
    name: "Windows 10/11 x64 (MSVC)",
    target: "x86_64-pc-windows-msvc",
    compiler: "MSVC 2022 + cargo",
    cmd: "cargo build --target x86_64-pc-windows-msvc --release && msix-packager",
    output: "target/release/SIAR_Messenger-0.1.0-x64.msix (Microsoft Authenticode Signed)"
  },
  android_ndk: {
    name: "Android Mobile (ARM64-v8a + ARMv7a)",
    target: "aarch64-linux-android / armv7-linux-androideabi",
    compiler: "cargo-ndk 3.5 + Android NDK r26d + Gradle 8.5",
    cmd: "cargo ndk -t arm64-v8a -t armeabi-v7a -t x86_64 -o app/src/main/jniLibs build --release",
    output: "app/build/outputs/apk/release/siar-messenger-0.1.0-universal.apk (28.4 MB, APK Sig v3)"
  },
  wasm_core: {
    name: "WebAssembly Browser Core",
    target: "wasm32-unknown-unknown",
    compiler: "wasm-pack 0.12 + wasm-opt -O4",
    cmd: "wasm-pack build crates/siar-protocol --target web --out-dir ../../site/public/wasm",
    output: "siar_protocol_bg.wasm (148 KB, SIMD optimized, zero-copy Postcard framing)"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initPipelineStepper();
  initMatrixExplorer();
  initSmokeTestRunner();
});

/**
 * Interactive 6-Stage Pipeline Stepper & Log Streamer
 */
function initPipelineStepper() {
  const btnTrigger = document.getElementById('btnTriggerPipeline');
  const stageNodes = document.querySelectorAll('.pipeline-stage-card');
  const terminalLog = document.getElementById('pipelineTerminalLog');

  if (!btnTrigger || !terminalLog) return;

  const STAGES = [
    {
      name: "1. Tag Push Event",
      logs: [
        "[INFO] Webhook received: refs/tags/v0.1.0 pushed by irshadali5",
        "[INFO] Validating GPG tag signature: 4F82 1B09 7E65 D34A... Valid OK",
        "[INFO] Release workflow triggered: .github/workflows/release.yml (Run ID: 1894218902)"
      ]
    },
    {
      name: "2. Quality Gates",
      logs: [
        "[EXEC] cargo test --all-targets --workspace ... 482 passed; 0 failed; 0 ignored",
        "[EXEC] cargo clippy --all-targets -- -D warnings ... clean, 0 warnings",
        "[EXEC] cargo deny check licenses advisories ... 0 security vulnerabilities found",
        "[EXEC] cargo fuzz run fuzz_postcard_wire (10k iter) ... 0 crashes detected"
      ]
    },
    {
      name: "3. Multi-Arch Parallel Matrix Build",
      logs: [
        "[BUILD:1] cargo zigbuild --target x86_64-unknown-linux-musl ... 42s OK",
        "[BUILD:2] cargo zigbuild --target aarch64-unknown-linux-musl ... 48s OK",
        "[BUILD:3] cargo build --target universal2-apple-darwin ... 55s OK",
        "[BUILD:4] cargo ndk -t arm64-v8a build (Android JNI) ... 64s OK",
        "[BUILD:5] wasm-pack build crates/siar-protocol --target web ... 12s OK"
      ]
    },
    {
      name: "4. Cryptographic Packaging & Attestation",
      logs: [
        "[PACK] Generating Debian .deb and Fedora .rpm binary packages...",
        "[SIGN] Minisign Ed25519 root signature attached (Key ID 7A9F4B)",
        "[SLSA] Cosign generating in-toto SLSA Level 3+ build provenance statement...",
        "[REKOR] Transparency log entry published at Rekor index #41908234"
      ]
    },
    {
      name: "5. Repository Index Sync",
      logs: [
        "[REPO] Generating APT dists/stable/InRelease with GPG keyring 0F4B2277...",
        "[REPO] Regenerating RPM x86_64/repodata/repomd.xml...",
        "[REPO] Updating F-Droid index-v2.json differential delta...",
        "[REPO] Syncing release manifest to https://siar.irshad.org.in/pkg/manifest.json"
      ]
    },
    {
      name: "6. Atomic Edge CDN Invalidation & Smoke Test",
      logs: [
        "[CDN] Syncing artifacts to Cloudflare R2 and MinIO EU Sovereign Mirror...",
        "[PURGE] Invalidation request sent to Cloudflare Edge: manifest.json, InRelease (12ms)",
        "[SMOKE] Running live verification: curl -fsSL https://siar.irshad.org.in/install.sh | sh --test",
        "[✓] SMOKE TEST PASSED: All 7 architecture hashes matched! Release v0.1.0 published successfully!"
      ]
    }
  ];

  btnTrigger.addEventListener('click', async () => {
    btnTrigger.disabled = true;
    btnTrigger.textContent = "⏳ Running Pipeline...";
    terminalLog.innerHTML = "";

    for (let i = 0; i < STAGES.length; i++) {
      const stage = STAGES[i];
      
      // Update UI stage active
      stageNodes.forEach((node, idx) => {
        if (idx === i) {
          node.classList.add('stage-active');
          node.classList.remove('stage-complete');
        } else if (idx < i) {
          node.classList.remove('stage-active');
          node.classList.add('stage-complete');
        } else {
          node.classList.remove('stage-active', 'stage-complete');
        }
      });

      appendLog(`\n=== STAGE ${stage.name} ===`, 'header');
      for (let log of stage.logs) {
        await sleep(300);
        appendLog(log, log.includes('passed') || log.includes('✓') ? 'ok' : 'info');
      }
      await sleep(400);
    }

    stageNodes.forEach(node => {
      node.classList.remove('stage-active');
      node.classList.add('stage-complete');
    });

    btnTrigger.disabled = false;
    btnTrigger.textContent = "🔁 Re-Run Release Simulation";
  });

  function appendLog(text, type = 'info') {
    const div = document.createElement('div');
    div.className = `log-line log-${type}`;
    div.textContent = text;
    terminalLog.appendChild(div);
    terminalLog.scrollTop = terminalLog.scrollHeight;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Multi-Arch Matrix Recipe Explorer
 */
function initMatrixExplorer() {
  const select = document.getElementById('selectMatrixTarget');
  const outName = document.getElementById('matrixOutName');
  const outTarget = document.getElementById('matrixOutTarget');
  const outCompiler = document.getElementById('matrixOutCompiler');
  const outCmd = document.getElementById('matrixOutCmd');
  const outArtifact = document.getElementById('matrixOutArtifact');

  if (!select) return;

  function update() {
    const key = select.value;
    const data = MATRIX_RECIPES[key];
    if (!data) return;

    if (outName) outName.textContent = data.name;
    if (outTarget) outTarget.textContent = data.target;
    if (outCompiler) outCompiler.textContent = data.compiler;
    if (outCmd) outCmd.textContent = data.cmd;
    if (outArtifact) outArtifact.textContent = data.output;
  }

  select.addEventListener('change', update);
  update();
}

/**
 * Automated Verification Smoke Test Runner
 */
function initSmokeTestRunner() {
  const btnRun = document.getElementById('btnRunSmokeTest');
  const outputBox = document.getElementById('smokeTestOutput');

  if (!btnRun || !outputBox) return;

  btnRun.addEventListener('click', () => {
    outputBox.innerHTML = `
      <div style="color: var(--siar-cyan-glow); font-family: var(--font-mono); font-size: 0.78rem;">
        $ curl -fsSL https://siar.irshad.org.in/install.sh | sh --test<br><br>
        [SIAR INSTALLER SMOKE TEST]<br>
        1. Detected OS: Linux (x86_64)<br>
        2. Fetching release manifest from: https://siar.irshad.org.in/pkg/manifest.json ... OK (200)<br>
        3. Validating Minisign Ed25519 Public Key: RWS1A5v7D1lQ0s8nQ... OK<br>
        4. Verifying SLSA Level 3 in-toto checksum ledger... OK<br>
        5. Binary download test (/releases/siar-cli-v0.1.0-x86_64-unknown-linux-musl.tar.gz) ... 7.8 MB / 7.8 MB [100%]<br>
        6. Validating SHA-256 Digest: 7a4fb918cc3da10ef49b127741d4735e3a265e16eee03f59718b9b5d03019c07 ... MATCHED<br>
        <span style="color: var(--siar-emerald-online); font-weight: 700;">[✓] ALL SMOKE TESTS PASSED: CDN Edge delivery is 100% operational!</span>
      </div>
    `;
  });
}
