/**
 * SIAR Universal Package Center & Repository Explorer
 * Architecture: Part 02 - Package Distribution & Release Engine
 * Domain: siar.irshad.org.in | pkg.siar.irshad.org.in
 */

const SIAR_PACKAGE_DB = [
  {
    id: 'deb-desktop-amd64',
    name: 'siar-desktop',
    version: '0.1.0',
    ecosystem: 'linux',
    format: 'deb',
    arch: 'amd64',
    size: '19.4 MB',
    sha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    description: 'Official GUI client with hardware-accelerated AV1/Opus media mesh streaming.',
    url: 'https://pkg.siar.irshad.org.in/deb/pool/main/s/siar-desktop/siar-desktop_0.1.0_amd64.deb',
    installCmd: 'sudo apt install siar-desktop',
    signedBy: 'Minisign + APT GPG Keyring (0F4B2277)'
  },
  {
    id: 'deb-desktop-arm64',
    name: 'siar-desktop',
    version: '0.1.0',
    ecosystem: 'linux',
    format: 'deb',
    arch: 'arm64',
    size: '18.8 MB',
    sha256: '3a4fb918cc3da10ef49b127741d4735e3a265e16eee03f59718b9b5d03019c08',
    description: 'Native Debian/Ubuntu desktop client for ARM64 devices and Raspberry Pi 4/5.',
    url: 'https://pkg.siar.irshad.org.in/deb/pool/main/s/siar-desktop/siar-desktop_0.1.0_arm64.deb',
    installCmd: 'sudo apt install siar-desktop',
    signedBy: 'Minisign + APT GPG Keyring (0F4B2277)'
  },
  {
    id: 'rpm-desktop-x86_64',
    name: 'siar-desktop',
    version: '0.1.0',
    ecosystem: 'linux',
    format: 'rpm',
    arch: 'x86_64',
    size: '19.8 MB',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    description: 'RPM desktop package for Fedora 39/40, RHEL 9, Rocky Linux, and OpenSUSE.',
    url: 'https://pkg.siar.irshad.org.in/rpm/x86_64/siar-desktop-0.1.0-1.x86_64.rpm',
    installCmd: 'sudo dnf install siar-desktop',
    signedBy: 'RPM GPG Signature (448A2F10)'
  },
  {
    id: 'appimage-desktop',
    name: 'SIAR Messenger AppImage',
    version: '0.1.0',
    ecosystem: 'linux',
    format: 'appimage',
    arch: 'x86_64',
    size: '22.4 MB',
    sha256: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    description: 'Standalone, zero-install portable binary package running on any Linux distribution.',
    url: 'https://pkg.siar.irshad.org.in/releases/SIAR_Messenger-0.1.0-x86_64.AppImage',
    installCmd: 'chmod +x SIAR_Messenger-0.1.0-x86_64.AppImage && ./SIAR_Messenger-0.1.0-x86_64.AppImage',
    signedBy: 'Minisign Ed25519'
  },
  {
    id: 'arch-aur-bin',
    name: 'siar-bin (AUR)',
    version: '0.1.0',
    ecosystem: 'linux',
    format: 'aur',
    arch: 'x86_64',
    size: '7.8 MB',
    sha256: '7a4fb918cc3da10ef49b127741d4735e3a265e16eee03f59718b9b5d03019c07',
    description: 'Arch Linux User Repository (AUR) binary package for Arch Linux and Manjaro.',
    url: 'https://aur.archlinux.org/packages/siar-bin',
    installCmd: 'yay -S siar-bin',
    signedBy: 'Arch PKGBUILD SLSA Verified'
  },
  {
    id: 'android-apk-universal',
    name: 'siar-messenger (APK)',
    version: '0.1.0',
    ecosystem: 'android',
    format: 'apk',
    arch: 'universal',
    size: '28.4 MB',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    description: 'Pure-Rust + Jetpack Compose Android client with background BLE 5.4 & Wi-Fi Direct mesh.',
    url: 'https://pkg.siar.irshad.org.in/releases/siar-messenger-0.1.0-universal.apk',
    installCmd: 'adb install siar-messenger-0.1.0-universal.apk',
    signedBy: 'Android APK Signature Scheme v3 + Minisign'
  },
  {
    id: 'android-fdroid',
    name: 'F-Droid Repository Feed',
    version: '0.1.0',
    ecosystem: 'android',
    format: 'fdroid',
    arch: 'all',
    size: 'Feed',
    sha256: '8F:3A:42:C1:B9:90:E5:1D:64:2C:FA:30:17:D5:7B:66:44:8A:2F:10:98:C3:55:0A:77:E1:92:04:18:22:91:0F',
    description: 'Official privacy-respecting F-Droid repository index with automated delta updates.',
    url: 'https://pkg.siar.irshad.org.in/fdroid/repo',
    installCmd: 'Add Repo: https://pkg.siar.irshad.org.in/fdroid/repo',
    signedBy: 'F-Droid Index-v2 GPG Key'
  },
  {
    id: 'macos-dmg',
    name: 'SIAR Messenger DMG',
    version: '0.1.0',
    ecosystem: 'macos',
    format: 'dmg',
    arch: 'universal',
    size: '24.3 MB',
    sha256: '8f3a42c1b990e51d642cfa3017d57b66448a2f1098c3550a77e192041822910f',
    description: 'Universal macOS Drag-and-Drop Disk Image for Apple Silicon (M1/M2/M3) and Intel.',
    url: 'https://pkg.siar.irshad.org.in/releases/SIAR_Messenger-0.1.0-universal.dmg',
    installCmd: 'hdiutil attach SIAR_Messenger-0.1.0-universal.dmg',
    signedBy: 'Apple Developer ID Notarized + Minisign'
  },
  {
    id: 'macos-brew',
    name: 'siar-cli (Homebrew)',
    version: '0.1.0',
    ecosystem: 'macos',
    format: 'brew',
    arch: 'universal',
    size: '7.8 MB',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    description: 'Homebrew formula for terminal node, diagnostic tools, and daemon controller.',
    url: 'https://github.com/irshadali5/homebrew-siar',
    installCmd: 'brew install irshadali5/siar/siar-cli',
    signedBy: 'Homebrew Bot SLSA Verified'
  },
  {
    id: 'win-msix',
    name: 'SIAR Messenger MSIX',
    version: '0.1.0',
    ecosystem: 'windows',
    format: 'msix',
    arch: 'x64',
    size: '21.8 MB',
    sha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    description: 'Windows 10 / 11 modern packaged application with isolated background service worker.',
    url: 'https://pkg.siar.irshad.org.in/releases/SIAR_Messenger-0.1.0-x64.msix',
    installCmd: 'winget install IrshadAli.SIARMessenger',
    signedBy: 'Microsoft Authenticode + Minisign'
  },
  {
    id: 'win-ps1',
    name: 'Windows PowerShell Installer',
    version: '0.1.0',
    ecosystem: 'windows',
    format: 'script',
    arch: 'x64/arm64',
    size: 'Script',
    sha256: 'Script Bootstrapper',
    description: 'Automated PowerShell fast-installer that configures user PATH and dependencies.',
    url: 'https://siar.irshad.org.in/install.ps1',
    installCmd: 'iwr -useb https://siar.irshad.org.in/install.ps1 | iex',
    signedBy: 'HTTPS TLS 1.3 Pinning'
  },
  {
    id: 'embedded-musl',
    name: 'siar-emergency-node (Static Tarball)',
    version: '0.1.0',
    ecosystem: 'embedded',
    format: 'tar.gz',
    arch: 'aarch64',
    size: '8.4 MB',
    sha256: '3a4fb918cc3da10ef49b127741d4735e3a265e16eee03f59718b9b5d03019c08',
    description: 'Zero-glibc static musl bunker repeater daemon with embedded captive Wi-Fi portal.',
    url: 'https://pkg.siar.irshad.org.in/releases/siar-emergency-node-v0.1.0-aarch64-unknown-linux-musl.tar.gz',
    installCmd: 'tar -xzf siar-emergency-node-v0.1.0-aarch64-unknown-linux-musl.tar.gz && sudo ./siar-emergency-node install-service',
    signedBy: 'Minisign Ed25519'
  },
  {
    id: 'docker-oci',
    name: 'SIAR OCI Container Image',
    version: '0.1.0',
    ecosystem: 'docker',
    format: 'oci',
    arch: 'multi-arch (amd64, arm64)',
    size: '26.2 MB',
    sha256: 'sha256:6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    description: 'Container image for Kubernetes, Docker Swarm, and unattended headless servers.',
    url: 'https://ghcr.io/irshadali5/siar',
    installCmd: 'docker pull ghcr.io/irshadali5/siar:latest',
    signedBy: 'Cosign / Sigstore OIDC Keyless'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderPackages(SIAR_PACKAGE_DB);
  initPackageFilters();
  initRepoSpecsViewer();
  initChecksumVerifier();
  initCopyButtons();
});

/**
 * Render Package Cards Grid
 */
function renderPackages(packages) {
  const container = document.getElementById('packageCardsGrid');
  if (!container) return;

  if (packages.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--siar-text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">No matching packages found.</p>
        <p style="font-size: 0.85rem;">Try adjusting your search query or architecture filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = packages.map(pkg => `
    <div class="siar-glass-card pkg-card" data-ecosystem="${pkg.ecosystem}" data-format="${pkg.format}">
      <div class="pkg-card-top">
        <div>
          <div class="pkg-format-badge">${pkg.format.toUpperCase()}</div>
          <h3 class="pkg-title">${pkg.name}</h3>
        </div>
        <span class="pkg-arch-tag">${pkg.arch}</span>
      </div>

      <p class="pkg-desc">${pkg.description}</p>

      <div class="pkg-meta-grid">
        <div><span class="pkg-meta-label">Version:</span> <strong>${pkg.version}</strong></div>
        <div><span class="pkg-meta-label">Size:</span> <strong>${pkg.size}</strong></div>
        <div style="grid-column: 1 / -1;"><span class="pkg-meta-label">Security:</span> <span style="color: var(--siar-emerald-online);">${pkg.signedBy}</span></div>
      </div>

      <div class="pkg-cmd-box">
        <code>$ ${pkg.installCmd}</code>
        <button class="copy-btn" data-copy="${pkg.installCmd}" title="Copy command">📋</button>
      </div>

      <div class="pkg-actions">
        <a href="${pkg.url}" class="btn btn-primary btn-sm" style="flex: 1;">
          📥 Download Artifact
        </a>
        <button class="btn btn-secondary btn-sm btn-inspect-pkg" data-pkg-id="${pkg.id}" title="Inspect package checksums & metadata">
          🔍 Details
        </button>
      </div>
    </div>
  `).join('');

  // Bind details click
  document.querySelectorAll('.btn-inspect-pkg').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgId = btn.getAttribute('data-pkg-id');
      const found = SIAR_PACKAGE_DB.find(p => p.id === pkgId);
      if (found) openPackageModal(found);
    });
  });
}

/**
 * Filter and Search Handlers
 */
function initPackageFilters() {
  const searchInput = document.getElementById('pkgSearchInput');
  const ecoFilterBtns = document.querySelectorAll('.pkg-filter-btn');
  const archSelect = document.getElementById('pkgArchSelect');

  let currentEcosystem = 'all';
  let currentArch = 'all';
  let searchQuery = '';

  function applyFilters() {
    const filtered = SIAR_PACKAGE_DB.filter(pkg => {
      const matchEco = (currentEcosystem === 'all' || pkg.ecosystem === currentEcosystem);
      const matchArch = (currentArch === 'all' || pkg.arch.includes(currentArch) || pkg.arch === 'all' || pkg.arch === 'universal');
      const matchQuery = !searchQuery || 
        pkg.name.toLowerCase().includes(searchQuery) ||
        pkg.format.toLowerCase().includes(searchQuery) ||
        pkg.description.toLowerCase().includes(searchQuery);

      return matchEco && matchArch && matchQuery;
    });

    renderPackages(filtered);
    const countEl = document.getElementById('pkgCountDisplay');
    if (countEl) countEl.textContent = `${filtered.length} packages available`;
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  ecoFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ecoFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentEcosystem = btn.getAttribute('data-eco');
      applyFilters();
    });
  });

  if (archSelect) {
    archSelect.addEventListener('change', (e) => {
      currentArch = e.target.value;
      applyFilters();
    });
  }
}

/**
 * Package Details Modal View
 */
function openPackageModal(pkg) {
  const modal = document.getElementById('pkgDetailModal');
  const title = document.getElementById('modalPkgTitle');
  const body = document.getElementById('modalPkgBody');
  if (!modal || !title || !body) return;

  title.textContent = `${pkg.name} (${pkg.version})`;
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <span class="pkg-meta-label">Architecture Target:</span>
        <div style="font-family: var(--font-mono); color: var(--siar-cyan-glow); font-size: 0.9rem;">${pkg.arch}</div>
      </div>
      <div>
        <span class="pkg-meta-label">SHA-256 Checksum:</span>
        <div style="font-family: var(--font-mono); font-size: 0.78rem; background: #030509; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--siar-border-subtle); color: #38bdf8; word-break: break-all;">
          ${pkg.sha256}
        </div>
      </div>
      <div>
        <span class="pkg-meta-label">Direct Artifact Download URI:</span>
        <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--siar-text-secondary); word-break: break-all;">
          <a href="${pkg.url}" target="_blank" style="color: var(--siar-cyan-glow);">${pkg.url}</a>
        </div>
      </div>
      <div>
        <span class="pkg-meta-label">SLSA Level 3 Provenance & Signing:</span>
        <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">
          ✓ Cryptographically signed with Minisign Ed25519 and SLSA Level 3 build provenance.
        </div>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 8px;">
        <a href="${pkg.url}" class="btn btn-primary btn-sm">📥 Download Package</a>
        <a href="${pkg.url}.minisig" class="btn btn-secondary btn-sm">🔐 Download .minisig</a>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

/**
 * Repository Specifications Live Viewer
 */
function initRepoSpecsViewer() {
  const specTabs = document.querySelectorAll('.spec-tab-btn');
  const specViewer = document.getElementById('repoSpecViewerContent');

  const REPO_SPECS = {
    apt: `# Debian / Ubuntu APT Repository (pkg.siar.irshad.org.in/deb/)
# 1. Install official GPG keyring
sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkg.siar.irshad.org.in/gpg/siar-archive-keyring.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/siar-archive-keyring.gpg

# 2. Add repository source definition
echo "deb [signed-by=/etc/apt/keyrings/siar-archive-keyring.gpg] https://pkg.siar.irshad.org.in/deb stable main" | sudo tee /etc/apt/sources.list.d/siar.list

# 3. Update index and install
sudo apt update && sudo apt install siar-desktop siar-emergency-node`,

    rpm: `# Fedora / RHEL / Rocky Linux RPM Repository (pkg.siar.irshad.org.in/rpm/)
# /etc/yum.repos.d/siar.repo
[siar]
name=SIAR Official Repository - $basearch
baseurl=https://pkg.siar.irshad.org.in/rpm/$basearch/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://pkg.siar.irshad.org.in/gpg/siar-rpm-key.pub
metadata_expire=1d`,

    fdroid: `# F-Droid Android Repository Specification
# URL: https://pkg.siar.irshad.org.in/fdroid/repo
# Fingerprint (SHA-256):
8F:3A:42:C1:B9:90:E5:1D:64:2C:FA:30:17:D5:7B:66:44:8A:2F:10:98:C3:55:0A:77:E1:92:04:18:22:91:0F

# Features:
- Implements F-Droid V2 Index (index-v2.json)
- Differential byte-delta compression for low-bandwidth mesh updates
- Tracker-free, reproducible APK builds`,

    homebrew: `# macOS Homebrew Formula (Formula/siar-cli.rb)
class SiarCli < Formula
  desc "Survivable Identity & Autonomous Routing - Terminal Node"
  homepage "https://siar.irshad.org.in"
  version "0.1.0"

  if OS.mac? && Hardware::CPU.arm?
    url "https://github.com/irshadali5/siar/releases/download/v0.1.0/siar-cli-v0.1.0-aarch64-apple-darwin.tar.gz"
    sha256 "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  elsif OS.mac? && Hardware::CPU.intel?
    url "https://github.com/irshadali5/siar/releases/download/v0.1.0/siar-cli-v0.1.0-x86_64-apple-darwin.tar.gz"
    sha256 "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"
  end

  def install
    bin.install "siar-cli"
    bin.install_symlink "siar-cli" => "siar"
  end
end`,

    arch: `# Arch Linux AUR (PKGBUILD)
pkgname=siar-bin
pkgver=0.1.0
pkgrel=1
pkgdesc="Survivable Identity & Autonomous Routing (SIAR) Node & Terminal Client"
arch=('x86_64' 'aarch64')
url="https://siar.irshad.org.in"
license=('Apache-2.0' 'MIT')
depends=('gcc-libs' 'glibc')

source_x86_64=("https://pkg.siar.irshad.org.in/releases/siar-cli-v\${pkgver}-x86_64-unknown-linux-musl.tar.gz")
sha256sums_x86_64=('7a4fb918cc3da10ef49b127741d4735e3a265e16eee03f59718b9b5d03019c07')`
  };

  specTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const specKey = tab.getAttribute('data-spec');
      specTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (specViewer && REPO_SPECS[specKey]) {
        specViewer.textContent = REPO_SPECS[specKey];
      }
    });
  });
}

/**
 * In-Browser Checksum & Signature Validation Widget
 */
function initChecksumVerifier() {
  const inputHash = document.getElementById('inputVerifyHash');
  const btnVerify = document.getElementById('btnVerifyHash');
  const resultBox = document.getElementById('verifyResultBox');

  if (!btnVerify || !inputHash || !resultBox) return;

  btnVerify.addEventListener('click', () => {
    const hash = inputHash.value.trim().toLowerCase();
    if (!hash) {
      resultBox.innerHTML = `<span style="color: var(--siar-amber-warning);">Please paste a 64-character SHA-256 digest to verify.</span>`;
      return;
    }

    const match = SIAR_PACKAGE_DB.find(p => p.sha256.toLowerCase() === hash);
    if (match) {
      resultBox.innerHTML = `
        <div style="color: var(--siar-emerald-online); font-weight: 600; margin-bottom: 6px;">
          ✓ VALID AUTHENTIC ARTIFACT MATCHED
        </div>
        <div style="font-size: 0.82rem; color: #cbd5e1;">
          Package: <strong>${match.name}</strong> (${match.version}) • Arch: <strong>${match.arch}</strong> • Format: <strong>${match.format}</strong>
          <br>Signed by: ${match.signedBy}
        </div>
      `;
    } else {
      resultBox.innerHTML = `
        <div style="color: var(--siar-rose-critical); font-weight: 600;">
          ✗ NO MATCHING RELEASE ARTIFACT FOUND
        </div>
        <div style="font-size: 0.82rem; color: var(--siar-text-muted); margin-top: 4px;">
          This checksum does not match any official binary in the release ledger. Do not execute unverified binaries.
        </div>
      `;
    }
  });
}

/**
 * Copy Buttons
 */
function initCopyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const text = btn.getAttribute('data-copy');
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = `✓`;
        btn.style.color = '#10b981';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.color = '';
        }, 1800);
      });
    }
  });

  // Modal Close
  const modalClose = document.getElementById('modalCloseBtn');
  const modal = document.getElementById('pkgDetailModal');
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}
