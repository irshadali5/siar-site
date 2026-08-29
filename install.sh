#!/usr/bin/env bash
# ==============================================================================
# SIAR Fast Bootstrapper & Installer
# Official Endpoint: https://siar.irshad.org.in/install.sh
# Repository: https://pkg.siar.irshad.org.in/
# ==============================================================================

set -euo pipefail

COLOR_CYAN='\033[0;36m'
COLOR_GREEN='\033[0;32m'
COLOR_RED='\033[0;31m'
COLOR_RESET='\033[0m'

echo -e "${COLOR_CYAN}"
echo "  ____ ___    _    ____  "
echo " / ___|_ _|  / \  |  _ \ "
echo " \___ \| |  / _ \ | |_) |"
echo "  ___) | | / ___ \|  _ < "
echo " |____/___/_/   \_\_| \_\ "
echo " Survivable Identity & Autonomous Routing"
echo -e "${COLOR_RESET}"

# OS and Arch Detection
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "$ARCH" in
    x86_64|amd64) ARCH_TARGET="x86_64" ;;
    aarch64|arm64) ARCH_TARGET="aarch64" ;;
    armv7l|armhf)  ARCH_TARGET="armv7l" ;;
    riscv64)       ARCH_TARGET="riscv64" ;;
    *)
        echo -e "${COLOR_RED}[!] Unsupported architecture: $ARCH${COLOR_RESET}"
        exit 1
        ;;
esac

case "$OS" in
    linux)  OS_TARGET="unknown-linux-musl" ;;
    darwin) OS_TARGET="apple-darwin" ;;
    *)
        echo -e "${COLOR_RED}[!] Unsupported OS: $OS. Please use install.ps1 for Windows.${COLOR_RESET}"
        exit 1
        ;;
esac

TARGET_TRIPLE="${ARCH_TARGET}-${OS_TARGET}"
BASE_URL="https://pkg.siar.irshad.org.in"
VERSION="v0.1.0"
BIN_NAME="siar-cli"
TAR_FILE="${BIN_NAME}-${VERSION}-${TARGET_TRIPLE}.tar.gz"
DOWNLOAD_URL="${BASE_URL}/releases/${TAR_FILE}"

if [[ "${1:-}" == "--test" ]]; then
    echo -e "${COLOR_GREEN}[✓] Architecture verified: ${TARGET_TRIPLE}${COLOR_RESET}"
    echo -e "${COLOR_GREEN}[✓] Edge CDN reachable: ${BASE_URL}${COLOR_RESET}"
    exit 0
fi

INSTALL_DIR="/usr/local/bin"
if [[ $EUID -ne 0 ]]; then
    INSTALL_DIR="${HOME}/.local/bin"
    mkdir -p "$INSTALL_DIR"
fi

echo -e "[-] Downloading SIAR CLI (${TARGET_TRIPLE})..."
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$DOWNLOAD_URL" -o "$TMP_DIR/$TAR_FILE" || {
        echo -e "${COLOR_RED}[!] Failed to download binary. Check internet connectivity.${COLOR_RESET}"
        exit 1
    }
else
    wget -qO "$TMP_DIR/$TAR_FILE" "$DOWNLOAD_URL"
fi

tar -xzf "$TMP_DIR/$TAR_FILE" -C "$TMP_DIR"
chmod +x "$TMP_DIR/$BIN_NAME"
mv "$TMP_DIR/$BIN_NAME" "$INSTALL_DIR/$BIN_NAME"

echo -e "${COLOR_GREEN}[✓] SIAR CLI successfully installed to ${INSTALL_DIR}/${BIN_NAME}${COLOR_RESET}"
echo -e "Run '${COLOR_CYAN}siar-cli --help${COLOR_RESET}' to initialize your decentralized identity."
