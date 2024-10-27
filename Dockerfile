# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Copy the rest of the application code
COPY . .

# Copy .env file
COPY .env .env

# Build the application
RUN yarn build

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
