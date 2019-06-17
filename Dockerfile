FROM node:11 AS build

ARG build_APP_API_HOST
ARG build_REACT_APP_BUILD_ENV
ARG build_NPM_TOKEN
ENV APP_API_HOST=${build_APP_API_HOST}
ENV REACT_APP_BUILD_ENV=${build_REACT_APP_BUILD_ENV}
ENV NPM_TOKEN=${build_NPM_TOKEN}

WORKDIR /app
COPY . .

RUN echo $NPM_TOKEN > .npmrc
RUN cat .npmrc
RUN yarn
RUN npm run build

FROM nginx:stable

COPY --from=build /app/build /var/www
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
