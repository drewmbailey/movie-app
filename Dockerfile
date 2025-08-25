# ---- Build Stage ----
FROM node:20 AS builder

WORKDIR /app
COPY . .

# Use environment variables passed in by Railway
ENV VITE_TMDB_KEY=${VITE_TMDB_KEY}
ENV VITE_OMDB_KEY=${VITE_OMDB_KEY}

# Install dependencies and build the project
RUN npm ci
RUN npm run build

# ---- Serve Stage ----
FROM caddy:alpine

# Copy the Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Copy the built static files
COPY --from=builder /app/dist /usr/share/caddy
