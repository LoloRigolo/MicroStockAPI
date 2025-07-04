FROM node:alpine

WORKDIR /usr/src/panier-app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3020

ENTRYPOINT [ "node", "index.js" ]
