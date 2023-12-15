FROM node:16-alpine

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


RUN echo $NPM_TOKEN > .npmrc && \
  sed -i -e "s#https://registry.yarnpkg.com#${REGISTRY_URL}#g" yarn.lock && \
  yarn install --registry $REGISTRY_URL --production && \
  rm -f .npmrc && \
  yarn cache clean

ENTRYPOINT [ "dumb-init" ]
CMD ["node", "--experimental-specifier-resolution=node", "--max-old-space-size=4096", "main.js"]
