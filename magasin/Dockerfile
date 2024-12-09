FROM node:alpine

WORKDIR /usr/src/magasin-app

EXPOSE 3007

RUN npm install express mongoose dotenv mongodb

ENTRYPOINT [ "node", "index.js" ]