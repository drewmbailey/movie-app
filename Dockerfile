# ---- Build Stage ----
FROM node:20 AS builder

WORKDIR /app
COPY . .

# Install dependencies and build the Vite app
RUN npm ci
RUN npm run build

# ---- Serve Stage ----
FROM caddy:alpine

# Copy the Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Copy the built static files
COPY --from=builder /app/dist /usr/share/caddy
