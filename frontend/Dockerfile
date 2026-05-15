# ============ BUILD STAGE ============
# Use Node to build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the production-ready React app
RUN npm run build

# ============ PRODUCTION STAGE ============
# Use lightweight Nginx to serve the built files
FROM nginx:alpine

# Copy built files from builder stage to nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (we'll create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default web port)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]