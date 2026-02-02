#!/bin/bash
set -e

echo "Starting deployment to dev server..."

# Configuration
DEV_SERVER_HOST="${DEV_SERVER_HOST:-your-server-host-here}"
PROJECT_NAME="sai-deal-assistant-frontend"
DEPLOY_DIR="${DEPLOY_DIR:-$HOME/${PROJECT_NAME}}"

# Stop and remove existing containers
echo "Stopping existing containers..."
cd "${DEPLOY_DIR}" && docker compose down 2>/dev/null || true

# Remove old images
echo "Removing old images..."
docker rmi ${PROJECT_NAME}-frontend:latest 2>/dev/null || true
docker rmi ${PROJECT_NAME}-bff:latest 2>/dev/null || true
docker rmi ${PROJECT_NAME}-proxy:latest 2>/dev/null || true

# Load the new images (extract from deploy.tar if present)
echo "Loading new Docker images..."
if [ -f /tmp/deploy.tar ]; then
  echo "Found /tmp/deploy.tar — extracting to /tmp/deploy"
  mkdir -p /tmp/deploy
  tar -xzf /tmp/deploy.tar -C /tmp/deploy || true

  # Load images from extracted tarball
  [ -f /tmp/deploy/frontend.tar ] && docker load -i /tmp/deploy/frontend.tar || true
  [ -f /tmp/deploy/bff.tar ] && docker load -i /tmp/deploy/bff.tar || true
  [ -f /tmp/deploy/proxy.tar ] && docker load -i /tmp/deploy/proxy.tar || true

  # Move docker-compose.yml and .env from archive
  echo "Setting up configuration from deploy archive..."
  mkdir -p "${DEPLOY_DIR}"
  [ -f /tmp/deploy/docker-compose.yml ] && mv /tmp/deploy/docker-compose.yml "${DEPLOY_DIR}/" || true
  [ -f /tmp/deploy/.env ] && mv /tmp/deploy/.env "${DEPLOY_DIR}/" || true

  # Move certs from extracted archive if present
  if [ -d /tmp/deploy/bff/certs ]; then
    mkdir -p "${DEPLOY_DIR}/bff/certs"
    mv /tmp/deploy/bff/certs/* "${DEPLOY_DIR}/bff/certs/" || true
    # Ensure safe ownership/permissions
    chown root:root "${DEPLOY_DIR}/bff/certs/"* 2>/dev/null || true
    chmod 600 "${DEPLOY_DIR}/bff/certs/key.pem" 2>/dev/null || true
    chmod 644 "${DEPLOY_DIR}/bff/certs/cert.pem" 2>/dev/null || true
  fi
else
  # Fallback: accept older upload formats
  docker load -i /tmp/frontend.tar || true
  docker load -i /tmp/bff.tar || true
  docker load -i /tmp/proxy.tar || true

  mkdir -p "${DEPLOY_DIR}"
  mv /tmp/docker-compose.yml "${DEPLOY_DIR}/" || true
  mv /tmp/.env "${DEPLOY_DIR}/" || true
  if [ -d /tmp/bff/certs ]; then
    mkdir -p "${DEPLOY_DIR}/bff/certs"
    mv /tmp/bff/certs/* "${DEPLOY_DIR}/bff/certs/" || true
    chown root:root "${DEPLOY_DIR}/bff/certs/"* 2>/dev/null || true
    chmod 600 "${DEPLOY_DIR}/bff/certs/key.pem" 2>/dev/null || true
    chmod 644 "${DEPLOY_DIR}/bff/certs/cert.pem" 2>/dev/null || true
  fi
fi

# Check TLS certs and basic deployment files
echo "Validating deployment files..."
if [ -d "${DEPLOY_DIR}/bff/certs" ]; then
  echo "Found TLS certs at ${DEPLOY_DIR}/bff/certs"
else
  echo "Warning: TLS certs not found at ${DEPLOY_DIR}/bff/certs. Proxy will start without TLS unless certs are provided or mounted at runtime."
fi

# Start the services using docker compose
echo "Starting services with docker compose..."
cd "${DEPLOY_DIR}"
docker compose up -d

# Clean up
echo "Cleaning up..."
rm -f /tmp/frontend.tar /tmp/bff.tar /tmp/proxy.tar /tmp/deploy.tar
rm -rf /tmp/deploy || true

# Show container status
echo "Deployment completed successfully!"
docker compose ps

echo "Application available at:"
echo "  Frontend: http://$DEV_SERVER_HOST:3000"
echo "  BFF:      http://$DEV_SERVER_HOST:3001"
echo "Application available at:"
echo "  Frontend: http://$DEV_SERVER_HOST:3000"
echo "  BFF:      http://$DEV_SERVER_HOST:3001"
