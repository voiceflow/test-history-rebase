FROM nginx:stable

ARG build_SEM_VER
ARG build_BUILD_NUM
ARG build_GIT_SHA

ENV VF_OVERRIDE_SEM_VER=${build_SEM_VER}
ENV VF_OVERRIDE_BUILD_NUM=${build_BUILD_NUM}
ENV VF_OVERRIDE_GIT_SHA=${build_GIT_SHA}

ENV PORT=80

COPY ./build /var/www
COPY ./config/start.sh /var/www
COPY ./config/locations.nginx.conf /etc/nginx/locations.nginx.conf
COPY ./config/nginx.conf /etc/nginx/conf.d/default.template

ENTRYPOINT [ "/var/www/start.sh" ]
