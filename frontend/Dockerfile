# Fetching the latest node image on apline linux
# FROM node:alpine AS builder
FROM chenxuanxiang.azurecr.io/nodebase AS builder
# Setting up the work directory
WORKDIR /app
# Installing dependencies
COPY ./package.json ./
# RUN npm install
# Copying all the files in our project
COPY . .
# Building our application
RUN npm run build

# FROM python:3.8.2-alpine
# WORKDIR /frontend
# COPY --from=builder /app/build /frontend
# EXPOSE 80
# CMD [ "python3", "-m", "http.server", "80"]

FROM python:3.8.2-alpine
WORKDIR /frontend
COPY ./requirements.txt .
COPY ./app.py .
RUN mkdir /frontend/build
COPY --from=builder /app/build /frontend/build
# COPY ./build /frontend/build
RUN pip install -r requirements.txt
ENV SERVER_PORT 80
ENV BACKEND_HOST https://face2facebackend.azurewebsites.net
EXPOSE 80
CMD [ "python3", "app.py"]