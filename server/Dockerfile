# 1. Base image
FROM node:22.15.0-alpine
WORKDIR /usr/src/app

# 2. Native build tools for bcrypt, sharp, etc.
RUN apk add --no-cache python3 make g++ vips-dev

# 3. Install only prod deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 4. Copy source
COPY . .

# 5. Prod mode
ENV NODE_ENV=production

EXPOSE 4000
CMD ["node", "server.js"]
