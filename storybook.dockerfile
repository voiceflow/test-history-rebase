FROM node:11 AS build

ARG NPM_TOKEN
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV NPM_TOKEN=${NPM_TOKEN}

WORKDIR /app
COPY . .

RUN echo $NPM_TOKEN > .npmrc
RUN yarn install
RUN yarn storybook:build
RUN rm -rf node_modules

ENTRYPOINT ["npx", "http-server", "storybook_build"]