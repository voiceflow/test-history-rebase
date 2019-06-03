FROM node:11 AS build

ARG build_APP_API_HOST
ARG build_REACT_APP_BUILD_ENV
ARG build_VOICEFLOW_API_HOST
ENV APP_API_HOST=${build_APP_API_HOST}
ENV VOICEFLOW_API_HOST=${build_VOICEFLOW_API_HOST}
ENV REACT_APP_BUILD_ENV=${build_REACT_APP_BUILD_ENV}

WORKDIR /app
COPY . .

RUN yarn
RUN npm run build

FROM nginx:stable

COPY --from=build /app/build /var/www
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
