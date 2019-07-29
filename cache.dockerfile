FROM node:11-alpine

ARG NPM_TOKEN

WORKDIR /tmp/app
COPY package.json package.json
COPY yarn.lock yarn.lock

# Utilities to install more packages
RUN apk update && \
  apk add python make g++ git

# Install all pacakges (prod & dev) since this is merely the base image for the build container
RUN echo $NPM_TOKEN > .npmrc && \
  yarn --pnp install && \
  rm -rf /tmp/app
