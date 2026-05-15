#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
#  deploy.sh  —  Pull latest images from ECR and (re)start the app
#  Run this on the EC2 instance from the project root:
#    bash deploy/deploy.sh
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config — must match ecr-push.sh ──────────────────────────────
AWS_REGION="${AWS_REGION:?Set AWS_REGION (e.g. us-east-1)}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:?Set AWS_ACCOUNT_ID}"
# ────────────────────────────────────────────────────────────────

ECR_BASE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
COMPOSE_FILE="docker-compose.prod.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "❌  $COMPOSE_FILE not found. Run this script from the project root."
  exit 1
fi

if [ ! -f ".env.prod" ]; then
  echo "❌  .env.prod not found."
  echo "    Copy backend/.env.example to .env.prod and fill in the values."
  exit 1
fi

echo "==> Authenticating Docker with ECR..."
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_BASE"

echo "==> Pulling latest images..."
export AWS_ACCOUNT_ID AWS_REGION
docker compose -f "$COMPOSE_FILE" --env-file .env.prod pull

echo "==> Stopping old containers (if any)..."
docker compose -f "$COMPOSE_FILE" --env-file .env.prod down --remove-orphans || true

echo "==> Starting containers..."
docker compose -f "$COMPOSE_FILE" --env-file .env.prod up -d

echo "==> Container status:"
docker compose -f "$COMPOSE_FILE" --env-file .env.prod ps

echo ""
echo "✅  DuoKart is live!"
echo "    Open http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo '<EC2-PUBLIC-IP>') in your browser."
