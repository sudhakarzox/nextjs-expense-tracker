# Dockerfile
# ---- Build stage ----
FROM node:19.8.0-alpine  AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build your app
RUN npm run build


# ---- Production stage ----
FROM node:19.8.0-alpine 

WORKDIR /app

# Copy only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy build output from builder stage
COPY --from=builder /app/dist ./dist

# (Optional) Copy static assets if needed
COPY --from=builder /app/public ./public

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set environment variables (set secrets at runtime, not here)
ENV PORT=3000

EXPOSE 3000

# Add a simple healthcheck (adjust path as appropriate)
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start the app
CMD ["npm", "start"]
