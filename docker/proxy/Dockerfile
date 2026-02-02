FROM nginx:alpine

# Copy nginx configuration
COPY proxy.conf /etc/nginx/conf.d/default.conf

# Create directory for certs (mounted at runtime)
RUN mkdir -p /etc/nginx/certs && chmod 755 /etc/nginx/certs

# Optional: healthcheck
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s \
  CMD wget -qO- --no-check-certificate https://localhost || exit 1
