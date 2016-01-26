FROM node:latest
MAINTAINER Charles Whitfield <whitfield.cw@gmail.com>

WORKDIR /wipn
ADD ./package.json /wipn/package.json
RUN npm install

WORKDIR /
ADD . ./wipn

EXPOSE 3000

WORKDIR /wipn
CMD ["node", "server.js"]