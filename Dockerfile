FROM library/node:14.15.3-alpine AS build

WORKDIR /temp

COPY ./frontend /temp

# Install the dependencies
RUN npm install
RUN npm run build

# Create a new stage for the final image
FROM socialengine/nginx-spa:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /temp/build /app

# Change permissions if needed
RUN chmod -R 777 /app