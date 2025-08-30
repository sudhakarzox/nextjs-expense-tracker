# Stage 1: Build
FROM node:latest AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
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

# Expose the port Next.js runs on
EXPOSE 3000

CMD ["npm", "start"]