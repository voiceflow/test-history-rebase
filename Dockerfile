FROM node:11 AS build

ARG build_VF_APP_API_HOST
ARG build_VF_APP_BUILD_ENV
ARG build_NPM_TOKEN
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV VF_APP_API_HOST=${build_VF_APP_API_HOST}
ENV VF_APP_BUILD_ENV=${build_VF_APP_BUILD_ENV}
ENV NPM_TOKEN=${build_NPM_TOKEN}

WORKDIR /app
COPY . .

RUN echo $NPM_TOKEN > .npmrc
RUN yarn
RUN yarn build

FROM nginx:stable

COPY --from=build /app/build /var/www
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
