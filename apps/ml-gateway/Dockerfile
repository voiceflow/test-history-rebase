FROM node:20-alpine

ARG NPM_TOKEN

ARG build_SEM_VER
ARG build_BUILD_NUM
ARG build_GIT_SHA
ARG build_BUILD_URL
ARG build_REGISTRY_URL="https://registry.yarnpkg.com"

ENV SEM_VER=${build_SEM_VER}
ENV BUILD_NUM=${build_BUILD_NUM}
ENV GIT_SHA=${build_GIT_SHA}
ENV BUILD_URL=${build_BUILD_URL}
ENV REGISTRY_URL=${build_REGISTRY_URL}

RUN apk --no-cache add git dumb-init

WORKDIR /usr/src/app
COPY ./build ./
COPY ./package.json ./
COPY ./yarn.lock ./


RUN yarn config set -H 'npmRegistries["https://registry.yarnpkg.com"].npmAuthToken' "${NPM_TOKEN#"//registry.npmjs.org/:_authToken="}" && \
  yarn workspaces focus --all --production  && \
  yarn config unset -H npmRegistries && \
  yarn cache clean

ENTRYPOINT [ "dumb-init" ]
CMD ["node", "--experimental-specifier-resolution=node", "--max-old-space-size=4096", "main.js"]
