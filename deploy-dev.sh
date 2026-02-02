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
if [ -f /tmp/proxy.tar ] || [ -f /tmp/proxy/proxy.conf ] || [ -f /tmp/docker/proxy/proxy.conf ] || [ -d /tmp/proxy ] || [ -d /tmp/docker/proxy ]; then
  mkdir -p "${DEPLOY_DIR}/docker"

  # Handle direct file uploads
  if [ -f /tmp/proxy/proxy.conf ]; then
    mv /tmp/proxy/proxy.conf "${DEPLOY_DIR}/docker/proxy.conf" || true
  fi
  if [ -f /tmp/docker/proxy/proxy.conf ]; then
    mv /tmp/docker/proxy/proxy.conf "${DEPLOY_DIR}/docker/proxy.conf" || true
  fi

  # Handle directory uploads (common when scp -r is used)
  if [ -d /tmp/proxy ] && [ -f /tmp/proxy/proxy.conf ]; then
    mv /tmp/proxy/proxy.conf "${DEPLOY_DIR}/docker/proxy.conf" || true
    rm -rf /tmp/proxy || true
  fi
  if [ -d /tmp/docker/proxy ] && [ -f /tmp/docker/proxy/proxy.conf ]; then
    mv /tmp/docker/proxy/proxy.conf "${DEPLOY_DIR}/docker/proxy.conf" || true
    rm -rf /tmp/docker/proxy || true
  fi

  # Normalize existing deploy directory if it contains nested /docker/proxy
  if [ -d "${DEPLOY_DIR}/docker/proxy" ] && [ -f "${DEPLOY_DIR}/docker/proxy/proxy.conf" ]; then
    mv "${DEPLOY_DIR}/docker/proxy/proxy.conf" "${DEPLOY_DIR}/docker/proxy.conf" || true
    rm -rf "${DEPLOY_DIR}/docker/proxy" || true
  fi

  # Handle accidental directory at proxy.conf (repair or remove)
  if [ -d "${DEPLOY_DIR}/docker/proxy.conf" ]; then
    echo "Repairing unexpected directory at ${DEPLOY_DIR}/docker/proxy.conf"
    # If a nested proxy.conf exists, move it into place
    if [ -f "${DEPLOY_DIR}/docker/proxy.conf/proxy.conf" ]; then
      mv "${DEPLOY_DIR}/docker/proxy.conf/proxy.conf" "${DEPLOY_DIR}/docker/proxy.conf.tmp" || true
      rm -rf "${DEPLOY_DIR}/docker/proxy.conf" || true
      mv "${DEPLOY_DIR}/docker/proxy.conf.tmp" "${DEPLOY_DIR}/docker/proxy.conf" || true
      echo "Replaced directory with nested proxy.conf file."
    elif [ -f "${DEPLOY_DIR}/docker/proxy.conf/default.conf" ]; then
      mv "${DEPLOY_DIR}/docker/proxy.conf/default.conf" "${DEPLOY_DIR}/docker/proxy.conf.tmp" || true
      rm -rf "${DEPLOY_DIR}/docker/proxy.conf" || true
      mv "${DEPLOY_DIR}/docker/proxy.conf.tmp" "${DEPLOY_DIR}/docker/proxy.conf" || true
      echo "Replaced directory with nested default.conf file."
    else
      # empty or unexpected contents — remove the directory so we can place a file
      echo "Removing empty or unexpected directory ${DEPLOY_DIR}/docker/proxy.conf"
      rm -rf "${DEPLOY_DIR}/docker/proxy.conf" || true
    fi
  fi
fi
if [ -d /tmp/bff/certs ]; then
  mkdir -p "${DEPLOY_DIR}/bff/certs"
  mv /tmp/bff/certs/* "${DEPLOY_DIR}/bff/certs/" || true
fi

# Validate proxy config before starting
echo "Validating deployment files..."
if [ -e "${DEPLOY_DIR}/docker/proxy.conf" ]; then
  if [ -f "${DEPLOY_DIR}/docker/proxy.conf" ]; then
    echo "Found proxy config: ${DEPLOY_DIR}/docker/proxy.conf"
  else
    echo "ERROR: ${DEPLOY_DIR}/docker/proxy.conf exists but is not a regular file. Aborting."
    echo "Run 'ls -la ${DEPLOY_DIR}/docker' on the host to inspect."
    exit 1
  fi
else
  echo "Warning: proxy config not found at ${DEPLOY_DIR}/docker/proxy.conf. Proxy may fail to start or will use built-in config."
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
