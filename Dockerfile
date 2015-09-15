FROM node:latest
MAINTAINER Charles Whitfield <whitfield.cw@gmail.com>

WORKDIR /app
ADD ./package.json /app/package.json
RUN npm install

WORKDIR /
ADD . ./app

EXPOSE 3000

WORKDIR /app
CMD ["node", "server.js"]