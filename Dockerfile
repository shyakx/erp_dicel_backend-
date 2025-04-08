# Use Node.js LTS version
FROM node:20-alpine

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    openssl \
    openssl-dev

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Copy prisma schema first
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm install

# Copy app source
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["npm", "start"] 