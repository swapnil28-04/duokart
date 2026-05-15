#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
#  ecr-push.sh  —  Build Docker images and push them to AWS ECR
#  Run this from the project root:  bash deploy/ecr-push.sh
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config — edit these ──────────────────────────────────────────
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:?Set AWS_ACCOUNT_ID in your environment}"
BACKEND_REPO="duokart-backend"
FRONTEND_REPO="duokart-frontend"
TAG="latest"
# ────────────────────────────────────────────────────────────────

ECR_BASE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "==> Authenticating Docker with ECR..."
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_BASE"

echo "==> Creating ECR repositories (skips if they already exist)..."
aws ecr describe-repositories --repository-names "$BACKEND_REPO" \
  --region "$AWS_REGION" > /dev/null 2>&1 \
  || aws ecr create-repository --repository-name "$BACKEND_REPO" \
       --region "$AWS_REGION"

aws ecr describe-repositories --repository-names "$FRONTEND_REPO" \
  --region "$AWS_REGION" > /dev/null 2>&1 \
  || aws ecr create-repository --repository-name "$FRONTEND_REPO" \
       --region "$AWS_REGION"

echo "==> Building backend image..."
docker build -t "${BACKEND_REPO}:${TAG}" ./backend

echo "==> Building frontend image..."
docker build -t "${FRONTEND_REPO}:${TAG}" ./frontend

echo "==> Tagging images..."
docker tag "${BACKEND_REPO}:${TAG}"  "${ECR_BASE}/${BACKEND_REPO}:${TAG}"
docker tag "${FRONTEND_REPO}:${TAG}" "${ECR_BASE}/${FRONTEND_REPO}:${TAG}"

echo "==> Pushing backend to ECR..."
docker push "${ECR_BASE}/${BACKEND_REPO}:${TAG}"

echo "==> Pushing frontend to ECR..."
docker push "${ECR_BASE}/${FRONTEND_REPO}:${TAG}"

echo ""
echo "✅  Done! Images pushed to ECR:"
echo "    ${ECR_BASE}/${BACKEND_REPO}:${TAG}"
echo "    ${ECR_BASE}/${FRONTEND_REPO}:${TAG}"
