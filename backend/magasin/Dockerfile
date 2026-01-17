FROM node:alpine

WORKDIR /usr/src/magasin-app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3007


ENTRYPOINT [ "node", "index.js" ]