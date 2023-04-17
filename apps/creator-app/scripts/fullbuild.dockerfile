FROM 168387678261.dkr.ecr.us-east-1.amazonaws.com/creator-app:latest-cache AS build

ARG VF_APP_VERSION
ARG VF_APP_API_HOST
ARG VF_APP_BUILD_ENV
ARG NPM_TOKEN
ARG VF_APP_MAINTENANCE_STATUS_SOURCE
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV VF_APP_VERSION=${VF_APP_VERSION}
ENV VF_APP_API_HOST=${VF_APP_API_HOST}
ENV VF_APP_BUILD_ENV=${VF_APP_BUILD_ENV}
ENV VF_APP_MAINTENANCE_STATUS_SOURCE=${VF_APP_MAINTENANCE_STATUS_SOURCE}

WORKDIR /app
COPY . .

# We can just do a regular install since we don't care about the size for the disposable build container
RUN echo $NPM_TOKEN > .npmrc && \
  yarn install && \
  yarn build

FROM nginx:stable

COPY --from=build /app/build /var/www
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
