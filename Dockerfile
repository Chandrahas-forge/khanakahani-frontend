# Stage 1: Build your app
FROM node:18-slim AS builder

WORKDIR /app


# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Deploy with Nginx
FROM nginx:alpine AS production

# Copy the built app from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx_entrypoint.sh /nginx_entrypoint.sh
RUN chmod +x /nginx_entrypoint.sh

# Expose port
EXPOSE 80

# Start Nginx
CMD ["/nginx_entrypoint.sh"]
