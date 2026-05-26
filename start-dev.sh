#!/usr/bin/env bash
# Start both the Django API and the Expo dev server.
# Run from the repo root: bash start-dev.sh

set -e

REPO="$(cd "$(dirname "$0")" && pwd)"
# Use the WiFi adapter IP (wlp2s0). Falls back to default-route src if not found.
LAN_IP=$(ip -4 addr show wlp2s0 2>/dev/null | awk '/inet / {split($2,a,"/"); print a[1]}')
[ -z "$LAN_IP" ] && LAN_IP=$(ip route get 8.8.8.8 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}')

echo "==> LAN IP: $LAN_IP"
echo ""

# Keep .env.local in sync with the detected IP
echo "EXPO_PUBLIC_API_HOST=$LAN_IP" > "$REPO/mobile/.env.local"
echo "==> Updated mobile/.env.local"
echo ""

# ── API ───────────────────────────────────────────────────────────────────────
echo "==> Starting Django API on 0.0.0.0:8000 ..."
cd "$REPO/api"
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000 &
API_PID=$!
cd "$REPO"

# ── Mobile ────────────────────────────────────────────────────────────────────
echo "==> Starting Expo (LAN host: $LAN_IP) ..."
echo "    Scan the QR code with Expo Go on your phone."
echo ""
cd "$REPO/mobile"
REACT_NATIVE_PACKAGER_HOSTNAME="$LAN_IP" npx expo start

# cleanup on exit
trap "kill $API_PID 2>/dev/null" EXIT
