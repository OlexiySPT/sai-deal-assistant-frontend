#!/bin/bash
set -e

echo "Starting deployment to dev server..."

# Configuration
DEV_SERVER_HOST="${DEV_SERVER_HOST:-your-server-host-here}"
PROJECT_NAME="sai-deal-assistant-frontend"

# Stop and remove existing containers
echo "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Remove old images
echo "Removing old images..."
docker rmi ${PROJECT_NAME}-frontend:latest 2>/dev/null || true
docker rmi ${PROJECT_NAME}-bff:latest 2>/dev/null || true

# Load the new images
echo "Loading new Docker images..."
docker load -i /tmp/frontend.tar
docker load -i /tmp/bff.tar

# Move docker-compose.yml and .env to deployment location
echo "Setting up configuration..."
mkdir -p /opt/${PROJECT_NAME}
mv /tmp/docker-compose.yml /opt/${PROJECT_NAME}/
mv /tmp/.env /opt/${PROJECT_NAME}/

# Start the services using docker-compose
echo "Starting services with docker-compose..."
cd /opt/${PROJECT_NAME}
docker-compose up -d

# Clean up
echo "Cleaning up..."
rm -f /tmp/frontend.tar /tmp/bff.tar

# Show container status
echo "Deployment completed successfully!"
docker-compose ps

echo "Application available at:"
echo "  Frontend: http://$DEV_SERVER_HOST:3000"
echo "  BFF:      http://$DEV_SERVER_HOST:3001"
