FROM node:13-alpine3.11

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY server/ ./server

EXPOSE 3000

CMD npm start