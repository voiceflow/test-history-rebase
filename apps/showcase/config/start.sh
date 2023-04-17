#!/bin/bash

sed "s/PORT/${PORT}/g" /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"
