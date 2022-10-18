FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD [ "serve", "-l", "3000", "-s", "build" ]