# Use a smaller base image
FROM node:14.15.3-alpine AS build

WORKDIR /temp

# Copy only package.json and package-lock.json first
COPY ./frontend/package*.json /temp/

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY ./frontend /temp

# Build the application
RUN npm run build

# Create a new stage for the final image
FROM socialengine/nginx-spa:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /temp/build /app

# Change permissions if needed
RUN chmod -R 777 /app
