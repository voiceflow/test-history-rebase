FROM nginx:stable

COPY ./build /var/www
COPY ./config/start.sh /var/www
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT [ "/var/www/start.sh" ]