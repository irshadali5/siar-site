#!/usr/bin/env bash
# ==============================================================================
# SIAR 1-Click Local Emergency Distribution Server
# Starts an immediate HTTP distribution server on port 8080 or 80
# ==============================================================================

set -euo pipefail

PORT="${1:-8080}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Starting SIAR Local Emergency Distribution Server ==="
echo "[*] Serving from: ${ROOT_DIR}"
echo "[*] Access via browser at: http://localhost:${PORT}/ or http://192.168.4.1:${PORT}/"

if command -v python3 >/dev/null 2>&1; then
    exec python3 -m http.server "${PORT}" --directory "${ROOT_DIR}"
elif command -v busybox >/dev/null 2>&1; then
    exec busybox httpd -f -p "${PORT}" -h "${ROOT_DIR}"
else
    echo "[-] Error: Python 3 or BusyBox required to run local HTTP server."
    exit 1
fi
