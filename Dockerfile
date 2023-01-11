FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY server/ ./server
COPY docs ./docs

EXPOSE 3000

CMD npm start