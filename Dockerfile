# Multi-stage Dockerfile for Cortexia AI
# Supports both Standalone Backend API mode and Full-Stack mode

FROM node:22-slim AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV MODE=api-only

# Start Express server via tsx
CMD ["npm", "run", "server"]
