# multi-stage builds

### STAGE 1: Build ###
FROM node:11.6.0-alpine AS builder

WORKDIR /frontend
COPY . /frontend

# Suppress NPM messages to speed 
# up dependencies installation
RUN npm set progress=false && \
    npm config set depth 0 && \ 
    npm cache clean --force

# Install dependencies and tools
RUN npm i && npm install -g gulp

# Build project
RUN npm run production

### STAGE 2: Setup ###
FROM nginx:1.15.8-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# From 'builder' stage copy over the artifacts in the
# distribution folder to the default nginx public folder
COPY --from=builder ./frontend/public /usr/share/nginx/html

# Remove unnecessary project folders and files
RUN rm -rf /frontend

CMD ["nginx", "-g", "daemon off;"]