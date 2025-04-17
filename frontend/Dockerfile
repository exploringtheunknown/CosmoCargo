FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Skapa public-katalogen och nödvändiga filer
RUN mkdir -p public
RUN echo "User-agent: *\nAllow: /" > public/robots.txt
RUN echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="#1E3A8A" /><path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="white" stroke-width="3" /><circle cx="50" cy="50" r="10" fill="#BE185D" /><path d="M20,20 L80,80" stroke="white" stroke-width="2" /><path d="M80,20 L20,80" stroke="white" stroke-width="2" /></svg>' > public/logo.svg
RUN echo '{"name":"CosmoCargo","short_name":"CosmoCargo","icons":[{"src":"/favicon.ico","sizes":"64x64 32x32 24x24 16x16","type":"image/x-icon"},{"src":"/logo.svg","type":"image/svg+xml","sizes":"192x192 512x512"}],"start_url":"/","display":"standalone","theme_color":"#1E3A8A","background_color":"#0F172A"}' > public/manifest.json
# Skapa en tom favicon.ico
RUN touch public/favicon.ico

# Build stage
FROM node:22-alpine AS build

# Define build arguments
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production

# Set environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=$NODE_ENV

WORKDIR /app
COPY package*.json ./
RUN npm ci

# Create necessary public files
COPY public ./public
COPY . .
RUN npm run build

# Runtime stage
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"] 