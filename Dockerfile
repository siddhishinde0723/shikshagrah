# Use an official Node.js image as the base
FROM node:20

# Set the working directory
WORKDIR /workspace

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire NX workspace
COPY . .

# Build all applications
# RUN npx nx run-many --target=build --all

# Build Specific Application
# Build only specific applications
RUN npx nx run-many --target=build --projects=shikshagraha-app

# Install PM2 to manage multiple apps
RUN npm install -g pm2

# Expose the ports for all apps
EXPOSE 3000

# Command to run all apps using PM2
CMD ["pm2-runtime", "ecosystem.test.config.js"]