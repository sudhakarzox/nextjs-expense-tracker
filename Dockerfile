# Stage 1: Build
FROM node:latest AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --ignore-scripts
# Copy only necessary source files
COPY src ./src
COPY public ./public
COPY next.config.ts ./
COPY tsconfig.json ./

ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

ARG NODE_ENV
ENV NODE_ENV=production

RUN npm run build 

# Stage 2: Serve
FROM node:alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

RUN npm install next

# Create a non-root user and switch
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs
USER nodeuser

# Expose the port Next.js runs on
EXPOSE 3000

CMD ["npm", "start"]