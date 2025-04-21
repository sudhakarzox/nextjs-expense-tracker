# Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Add build arg and pass it to ENV
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

RUN npm run build

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]
