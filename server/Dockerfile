FROM node:20-alpine

WORKDIR /server

COPY package*.json .
COPY package-lock*.json .

RUN npm install

EXPOSE 8000
