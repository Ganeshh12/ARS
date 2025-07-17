# Stage 1: Build React frontend using workspace
FROM node:20.19.3-alpine as builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy the entire repo (needed for workspace builds)
COPY . .

# Install only frontend workspace
RUN npm install --workspace=frontend

# Build frontend
RUN npm run build --workspace=frontend

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
