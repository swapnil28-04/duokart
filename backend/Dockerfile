# Use official Node.js 20 image as base
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (Docker caching trick — speeds up rebuilds)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy all backend code into container
COPY . .

# Expose port 5001 (so other containers can talk to it)
EXPOSE 5001

# Command to start the server
CMD ["node", "server.js"]