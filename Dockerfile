FROM node:8

WORKDIR /usr/src/app

COPY ./ ./

RUN yarn

RUN cd ./app && yarn

RUN npm run build

RUN npm install -g forever

EXPOSE 8080
EXPOSE 6379
EXPOSE 5432

CMD forever -c "npm run start" .
