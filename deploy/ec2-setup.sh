#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
#  ec2-setup.sh  —  One-time setup script for a fresh EC2 instance
#  Paste this into EC2 User Data  OR  run it via SSH after launch.
#  Tested on Amazon Linux 2023 and Ubuntu 22.04.
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Detect distro ────────────────────────────────────────────────
if command -v dnf &>/dev/null; then
  PKG="dnf"          # Amazon Linux 2023
elif command -v apt-get &>/dev/null; then
  PKG="apt"          # Ubuntu / Debian
else
  echo "Unsupported package manager"; exit 1
fi

echo "==> Updating system packages..."
if [ "$PKG" = "dnf" ]; then
  sudo dnf update -y
  sudo dnf install -y docker git
else
  sudo apt-get update -y
  sudo apt-get install -y docker.io git curl
fi

echo "==> Starting Docker..."
sudo systemctl enable docker
sudo systemctl start docker

echo "==> Adding ec2-user / ubuntu to docker group..."
sudo usermod -aG docker "${USER:-ec2-user}" 2>/dev/null || true
sudo usermod -aG docker ubuntu 2>/dev/null || true

echo "==> Installing Docker Compose v2 plugin..."
DOCKER_CONFIG=${DOCKER_CONFIG:-/usr/local/lib/docker}
sudo mkdir -p "$DOCKER_CONFIG/cli-plugins"
sudo curl -SL \
  "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" \
  -o "$DOCKER_CONFIG/cli-plugins/docker-compose"
sudo chmod +x "$DOCKER_CONFIG/cli-plugins/docker-compose"

echo "==> Installing AWS CLI v2..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-$(uname -m).zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install --update
rm -rf awscliv2.zip aws/

echo ""
echo "✅  EC2 setup complete!"
echo "   Log out and back in (or run 'newgrp docker') so group changes take effect."
echo "   Then run:  bash deploy/deploy.sh"
