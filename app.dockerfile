FROM nginx:stable

ENV VF_ENV_PORT=80

COPY ./build /var/www
COPY ./config/start.sh /var/www
COPY ./config/nginx.conf /etc/nginx/conf.d/default.template

ENTRYPOINT [ "/var/www/start.sh" ]