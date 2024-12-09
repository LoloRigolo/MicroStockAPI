FROM node:alpine

WORKDIR /usr/src/auth-app

EXPOSE 3010

RUN npm install express mongoose dotenv mongodb crypto

ENTRYPOINT [ "node", "index.js" ]