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

# Load the new images
echo "Loading new Docker images..."
docker load -i /tmp/frontend.tar
docker load -i /tmp/bff.tar
docker load -i /tmp/proxy.tar

# Move docker-compose.yml, proxy.conf and certs to deployment location
echo "Setting up configuration..."
mkdir -p "${DEPLOY_DIR}"
mv /tmp/docker-compose.yml "${DEPLOY_DIR}/"
mv /tmp/.env "${DEPLOY_DIR}/"
# move proxy config and certs (if provided)
if [ -f /tmp/proxy.tar ] || [ -f /tmp/proxy/proxy.conf ]; then
  mkdir -p "${DEPLOY_DIR}/docker"
  mv /tmp/proxy/proxy.conf "${DEPLOY_DIR}/docker/proxy.conf" || true
fi
if [ -d /tmp/bff/certs ]; then
  mkdir -p "${DEPLOY_DIR}/bff/certs"
  mv /tmp/bff/certs/* "${DEPLOY_DIR}/bff/certs/" || true
fi

# Start the services using docker compose
echo "Starting services with docker compose..."
cd "${DEPLOY_DIR}"
docker compose up -d

# Clean up
echo "Cleaning up..."
rm -f /tmp/frontend.tar /tmp/bff.tar /tmp/proxy.tar

# Show container status
echo "Deployment completed successfully!"
docker compose ps

echo "Application available at:"
echo "  Frontend: http://$DEV_SERVER_HOST:3000"
echo "  BFF:      http://$DEV_SERVER_HOST:3001"
echo "Application available at:"
echo "  Frontend: http://$DEV_SERVER_HOST:3000"
echo "  BFF:      http://$DEV_SERVER_HOST:3001"
