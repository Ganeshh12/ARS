# Stage 1: Build everything
FROM node:20.19.3-alpine as builder

WORKDIR /app
COPY package*.json ./
COPY frontend ./frontend
COPY backend ./backend

# Install build tools for native modules like bcrypt
RUN apk add --no-cache python3 make g++ \
    && npm install \
    && npm run build --workspace=frontend

# Stage 2: Production image
FROM node:20.19.3-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/frontend ./frontend
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/backend
EXPOSE 5000
CMD ["npm", "start", "--workspace=backend"]
