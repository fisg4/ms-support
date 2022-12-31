FROM node:13-alpine3.11

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --no-optional

COPY server/ ./server
COPY docs ./docs

EXPOSE 3000

CMD npm start