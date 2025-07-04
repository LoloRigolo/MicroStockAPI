FROM node:alpine

WORKDIR /usr/src/commande-app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3021

ENTRYPOINT [ "node", "index.js" ]
