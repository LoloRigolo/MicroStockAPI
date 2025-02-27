FROM node:alpine

WORKDIR /usr/src/vente-app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 3015

CMD ["node", "dist/index.js"]
