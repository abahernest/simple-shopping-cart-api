FROM node:16.17-alpine
# ENV NODE_ENV=production

WORKDIR /app

COPY ["package*.json","./"]

RUN npm install -g npm@8.15.0

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*
RUN npm install 

COPY . .