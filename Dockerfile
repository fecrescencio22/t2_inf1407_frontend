FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY typescript/ ./typescript/
COPY public/ ./public/
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/public/ /usr/share/nginx/html/
EXPOSE 80
