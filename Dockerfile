# Use lightweight official Node.js Alpine base image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy remaining source code
COPY . .

# Expose application port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Command to start application
CMD ["node", "server.js"]
