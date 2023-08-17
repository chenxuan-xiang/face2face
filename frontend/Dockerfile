# Fetching the latest node image on apline linux
FROM node:alpine AS builder
# Setting up the work directory
WORKDIR /app
# Installing dependencies
COPY ./package.json ./
RUN npm install
# Copying all the files in our project
COPY . .
# Building our application
RUN npm run build

FROM python:3.8.2-alpine
WORKDIR /frontend
COPY --from=builder /app/build /frontend
EXPOSE 80
CMD [ "python3", "-m", "http.server", "80"]
