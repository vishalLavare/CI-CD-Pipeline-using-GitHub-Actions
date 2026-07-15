#!/bin/bash
# ==============================================================================
# Production Deployment Script for EC2 Host
# ==============================================================================
# This script is executed on the EC2 instance by GitHub Actions via SSH.
# It logs in to Amazon ECR, pulls the new image, restarts the container, and verifies health.
# ==============================================================================

set -euo pipefail

# Inputs from GitHub Actions
AWS_ACCOUNT_ID="${1:-}"
AWS_REGION="${2:-}"
ECR_REPOSITORY="${3:-}"
IMAGE_TAG="${4:-}"

# Define constants
CONTAINER_NAME="fastapi_app"
HOST_PORT=8000
CONTAINER_PORT=8000

# Logging helpers
log() {
    echo -e "\033[1;32m[DEPLOY] $1\033[0m"
}

error() {
    echo -e "\033[1;31m[ERROR] $1\033[0m" >&2
}

# 1. Validate inputs
if [ -z "$AWS_ACCOUNT_ID" ] || [ -z "$AWS_REGION" ] || [ -z "$ECR_REPOSITORY" ] || [ -z "$IMAGE_TAG" ]; then
    error "Missing required arguments!"
    echo "Usage: $0 <AWS_ACCOUNT_ID> <AWS_REGION> <ECR_REPOSITORY> <IMAGE_TAG>"
    exit 1
fi

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_URI="${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}"

log "Starting deployment process for image: $IMAGE_URI"

# 2. Login to Amazon ECR on EC2
log "Logging in to Amazon ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_REGISTRY}"

# 3. Pull latest image
log "Pulling Docker image from ECR: $IMAGE_URI"
docker pull "$IMAGE_URI"

# 4. Stop and remove existing container (if running)
if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
    log "Existing container '${CONTAINER_NAME}' found. Stopping..."
    docker stop "${CONTAINER_NAME}" || true
    
    log "Removing existing container..."
    docker rm "${CONTAINER_NAME}" || true
fi

# 5. Run new container
log "Starting new container '${CONTAINER_NAME}'..."
docker run -d \
    --name "${CONTAINER_NAME}" \
    -p "${HOST_PORT}:${CONTAINER_PORT}" \
    --restart unless-stopped \
    -e ENV_TYPE=production \
    -e AWS_REGION="${AWS_REGION}" \
    "$IMAGE_URI"

# 6. Clean up old unused Docker images (to prevent disk filling up)
log "Cleaning up dangling and unused Docker images..."
docker image prune -f

# 7. Verification - Loop Health Check
log "Verifying application health..."
MAX_ATTEMPTS=6
SLEEP_SECS=5
HEALTHY=false

for i in $(seq 1 $MAX_ATTEMPTS); do
    # Try calling the local /health endpoint
    if RESPONSE=$(curl -s --fail http://localhost:${HOST_PORT}/health); then
        if echo "$RESPONSE" | grep -q '"status":"healthy"'; then
            log "Deployment verification PASSED! Health check responded with 'healthy'."
            HEALTHY=true
            break
        fi
    fi
    log "Attempt $i/$MAX_ATTEMPTS: App is not online/healthy yet. Retrying in $SLEEP_SECS seconds..."
    sleep "$SLEEP_SECS"
done

if [ "$HEALTHY" = "false" ]; then
    error "Deployment verification FAILED! Container log output:"
    docker logs --tail 20 "${CONTAINER_NAME}"
    exit 1
fi

log "Deployment completed successfully!"
