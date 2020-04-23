FROM nginx:stable

COPY ./admin_build /var/www
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
