FROM node:12 AS build

ARG NPM_TOKEN
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV NPM_TOKEN=${NPM_TOKEN}

WORKDIR /usr/src/app
COPY . .

RUN echo $NPM_TOKEN > .npmrc && \
  yarn install && \
  yarn storybook:build && \
  rm -f .npmrc

FROM node:12-alpine

WORKDIR /var/www/storybook
COPY --from=build /usr/src/app/storybook_build /var/www/storybook

ENTRYPOINT ["npx", "http-server", "/var/www/storybook", "-p", "80"]