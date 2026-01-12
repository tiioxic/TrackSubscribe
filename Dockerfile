# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --production

# Copy built frontend from builder
COPY --from=builder /app/dist ./dist

# Copy backend source
COPY --from=builder /app/server ./server

# Create directory for sqlite database and set permissions
RUN mkdir -p /app/server/data && chown -R node:node /app/server

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "server/index.js"]
