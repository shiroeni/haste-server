FROM node:latest

WORKDIR /app
COPY ./package-lock.json .
COPY ./package.json .
RUN npm install

COPY . .

EXPOSE 7777

VOLUME [ "/data" ]

CMD [ "npm", "start" ]