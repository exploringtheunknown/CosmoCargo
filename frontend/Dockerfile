# Build stage
FROM node:22-alpine AS build

ARG NEXT_PUBLIC_API_BASE_URL
ARG NODE_ENV=production

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

# Install dependencies first for better cache
COPY package*.json ./
RUN npm ci --include=dev

# Copy the rest of the code
COPY . .

RUN npm run build

# Runtime stage
FROM node:22-alpine AS runtime
WORKDIR /app

# Only copy necessary files for runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

EXPOSE 3000
CMD ["npm", "start"]