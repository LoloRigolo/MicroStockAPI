FROM node:alpine

WORKDIR /usr/src/stockage-app

EXPOSE 3013

RUN npm install express mongoose dotenv mongodb

ENTRYPOINT [ "node", "index.js" ]