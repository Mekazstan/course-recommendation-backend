# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Create .env file from build-time environment variables (for Render)
RUN echo "DATABASE_URL=$DATABASE_URL" > .env && \
    echo "JWT_SECRET=$JWT_SECRET" >> .env && \
    echo "NODE_ENV=production" >> .env && \
    echo "PORT=3000" >> .env

# Generate Prisma client
RUN npx prisma generate

# Build the application (if needed)
# RUN yarn build

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]