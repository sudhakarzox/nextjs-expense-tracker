# ---- Build stage ----
FROM node:19.8.0-alpine AS builder

WORKDIR /app

# Copy dependency files separately (explicit filenames)
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci --quiet

# Copy source code explicitly
COPY next.config.js ./
COPY public ./public
COPY src ./src

# Build the Next.js app
RUN npm run build

# ---- Production stage ----
FROM node:19.8.0-alpine

# Create a non-root user and group for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production dependencies only
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --only=production --quiet

# Copy build output and public assets from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Fix permissions for non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["npm", "start"]
