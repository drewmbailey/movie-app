# ---- Build Stage ----
FROM node:20 AS builder

WORKDIR /app
COPY . .

# Accept Railway ENV vars as build args
ARG VITE_TMDB_KEY
ARG VITE_OMDB_KEY

# Inject those args as environment variables for Vite
ENV VITE_TMDB_KEY=$VITE_TMDB_KEY
ENV VITE_OMDB_KEY=$VITE_OMDB_KEY

RUN npm ci
RUN npm run build

# ---- Serve Stage ----
FROM caddy:alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /usr/share/caddy
