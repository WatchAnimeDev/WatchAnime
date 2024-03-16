FROM node:20

RUN mkdir -p /temp

# Set the working directory inside the container
WORKDIR /temp

COPY ./frontend /temp

# Install the dependencies
RUN npm install
RUN npm run build

COPY ./build /app

RUN rm -rf /temp

FROM socialengine/nginx-spa:latest
RUN chmod -R 777 /app