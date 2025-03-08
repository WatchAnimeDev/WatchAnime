# Use a smaller base image
FROM node:14.15.3-alpine AS build

WORKDIR /temp

# Copy only package.json and package-lock.json first
COPY ./frontend/package*.json /temp/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY ./frontend /temp

# Build the application
RUN npm run build

FROM golang:1.21.5-bullseye

# Set the working directory inside the container
WORKDIR /app

COPY . .

RUN go get
RUN go build -o bin .

# Copy the built files from the previous stage
COPY --from=build /temp/build /app

ENTRYPOINT ["/app/bin"]
