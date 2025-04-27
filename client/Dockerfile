# Stage 1: build the React + Vite app
FROM node:22.15.0-alpine AS build
WORKDIR /app

# copy lockfiles & config to leverage layer caching
COPY package.json package-lock.json vite.config.ts ./

# install ALL deps (dev + prod) for the build
RUN npm ci

# copy source & build
COPY . .
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
