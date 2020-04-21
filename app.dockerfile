FROM nginx:stable

COPY ./build /var/www
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
