FROM node:8

WORKDIR /usr/src/app

COPY ./ ./

RUN yarn

RUN cd ./app && yarn

ARG REACT_APP_BUILD_ENV

RUN REACT_APP_BUILD_ENV=$REACT_APP_BUILD_ENV npm run build

RUN npm install -g forever

EXPOSE 8080

CMD forever -c "node index.js" .
