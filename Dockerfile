FROM node:8

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install -g forever && yarn && cd ./app && yarn

RUN npm run build

EXPOSE 8080

CMD forever -c "node index.js" .
