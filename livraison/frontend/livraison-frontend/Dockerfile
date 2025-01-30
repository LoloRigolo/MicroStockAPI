FROM node:alpine

WORKDIR /usr/src/app

EXPOSE 4200

RUN npm install -g @angular/cli

ENTRYPOINT ["ng", "serve", "--host", "0.0.0.0"]