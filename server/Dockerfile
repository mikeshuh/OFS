# Use node LTS on Alpine for a small, secure image
FROM node:22.15.0-alpine
WORKDIR /usr/src/app

# add compilers & libvips for native modules (bcrypt, sharp, etc.)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev

# install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# copy app source
COPY . .

# optimize for prod
ENV NODE_ENV=production

EXPOSE 4000
CMD ["node", "server.js"]
