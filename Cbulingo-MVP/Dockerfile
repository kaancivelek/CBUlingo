# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1

# --- Build Stage ---
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies (npm ci for deterministic builds)
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the application source
COPY --link . .

# Build the production-ready static files
RUN npm run build

# Remove dev dependencies to minimize final image size
RUN npm prune --production

# --- Production Stage ---
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy only the built app and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
USER appuser

# Vite preview defaults to port 4173
EXPOSE 4173

CMD ["npx", "vite", "preview", "--host"]
