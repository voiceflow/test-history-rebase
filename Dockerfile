FROM node:11

WORKDIR /usr/src/app

COPY ./ ./

# Just to protect against accidental copying
RUN rm -rf node_modules/ && \
  rm -rf app/node_modules/

RUN npm install --production

RUN cd ./app && yarn

RUN npm run build

RUN rm -rf ./app/node_modules && rm -rf ./app/public

RUN npm install -g forever

EXPOSE 8080

CMD forever -c "node index.js" .
