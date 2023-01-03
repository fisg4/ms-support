FROM node:13-alpine3.11

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install -g npm@9.2.0

COPY server/ ./server
COPY docs ./docs

EXPOSE 3000

CMD npm start