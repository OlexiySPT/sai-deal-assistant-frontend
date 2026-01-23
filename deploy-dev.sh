#!/bin/bash
set -e

echo "Starting deployment to dev server..."

# Configuration
# Set DEV_SERVER_HOST environment variable or it will use the placeholder below
DEV_SERVER_HOST="${DEV_SERVER_HOST:-your-server-host-here}"
CONTAINER_NAME="sai-deal-assistant-frontend-dev"
IMAGE_NAME="sai-deal-assistant-frontend:dev"
HOST_PORT_HTTP=3000
HOST_PORT_HTTPS=3443
CONTAINER_PORT_HTTP=80
CONTAINER_PORT_HTTPS=443

# Stop and remove existing container if it exists
echo "Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Clean up old config directory created by Docker volume mount
rm -rf /tmp/frontend-config/config.json 2>/dev/null || true

# Remove old image if exists
echo "Removing old image..."
docker rmi $IMAGE_NAME 2>/dev/null || true

# Load the new image
echo "Loading new Docker image..."
docker load -i /tmp/sai-deal-assistant-frontend-dev.tar

# Create dev config
echo "Creating dev configuration..."
mkdir -p /tmp/frontend-config
if [ -f /tmp/config.dev.json ]; then
  cat /tmp/config.dev.json > /tmp/frontend-config/config.json
else
  echo "Warning: config.dev.json not found, using default"
  echo '{"apiBaseUrl": "https://your-server:5001"}' > /tmp/frontend-config/config.json
fi

# Generate self-signed certificate if not exists
echo "Setting up SSL certificates..."
mkdir -p /tmp/frontend-ssl
if [ ! -f /tmp/frontend-ssl/cert.pem ]; then
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /tmp/frontend-ssl/key.pem \
    -out /tmp/frontend-ssl/cert.pem \
    -subj "/CN=$DEV_SERVER_HOST"
fi

# Run the new container
echo "Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $HOST_PORT_HTTP:$CONTAINER_PORT_HTTP \
  -p $HOST_PORT_HTTPS:$CONTAINER_PORT_HTTPS \
  -v /tmp/frontend-config/config.json:/usr/share/nginx/html/config.json:ro \
  -v /tmp/frontend-ssl:/etc/nginx/ssl:ro \
  $IMAGE_NAME

# Clean up
echo "Cleaning up..."
rm -f /tmp/sai-deal-assistant-frontend-dev.tar

# Show container status
echo "Deployment completed successfully!"
docker ps | grep $CONTAINER_NAME

echo "Application available at:"
echo "  HTTP:  http://$DEV_SERVER_HOST:$HOST_PORT_HTTP"
echo "  HTTPS: https://$DEV_SERVER_HOST:$HOST_PORT_HTTPS"
