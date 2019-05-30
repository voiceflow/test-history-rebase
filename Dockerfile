FROM node:11

#ENV NODE_ENV production
ENV UV_THREADPOOL_SIZE 10
ARG NPM_TOKEN

WORKDIR /usr/src/app

COPY ./ ./

# Just to protect against accidental copying
RUN rm -rf node_modules/ && \
  rm -rf app/node_modules/ && \
  rm -rf app/build

# If these three steps are done without using --squash on docker build, the creds remain in the image, though hidden
RUN echo $NPM_TOKEN > .npmrc
RUN npm install --production
RUN rm -f .npmrc

RUN cd ./app && yarn --production

RUN npm run build

RUN rm -rf ./app/node_modules && rm -rf ./app/public

RUN npm install -g forever

EXPOSE 8080

CMD forever -c "node index.js" .
