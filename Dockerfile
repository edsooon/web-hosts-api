FROM node:latest
MAINTAINER Edson Mello (edson@softbox.com.br)
COPY . /web-hosts
WORKDIR /web-hosts
RUN npm install
ENTRYPOINT npm run web-hosts
VOLUME /etc:/path
EXPOSE 3000
