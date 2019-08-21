FROM 168387678261.dkr.ecr.us-east-1.amazonaws.com/creator-app:latest-cache AS build

ARG VF_APP_API_HOST
ARG VF_APP_BUILD_ENV
ARG NPM_TOKEN
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV VF_APP_API_HOST=${VF_APP_API_HOST}
ENV VF_APP_BUILD_ENV=${VF_APP_BUILD_ENV}

WORKDIR /app
COPY . .

RUN echo $NPM_TOKEN > .npmrc && \
  yarn install && \
  yarn build:admin

FROM nginx:stable

COPY --from=build /app/adminbuild /var/www
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
