FROM node:16.18.1

WORKDIR /usr/src/app

COPY . .

EXPOSE 3000

CMD yarn start:dev
