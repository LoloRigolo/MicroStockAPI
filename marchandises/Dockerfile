FROM node:alpine

WORKDIR /usr/src/marchandise-app

EXPOSE 3012

RUN npm install express mongoose dotenv mongodb

ENTRYPOINT [ "node", "index.js" ]