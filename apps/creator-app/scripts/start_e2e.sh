#! /bin/bash

# Current script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
REPO_DIR=${SCRIPT_DIR}/../

cp -R ${REPO_DIR}/build/. /var/www
cp -R ${REPO_DIR}/certs/. /etc/nginx/ssl
cp ${REPO_DIR}/config/nginx.e2e.conf /etc/nginx/conf.d/default.conf
cp ${REPO_DIR}/config/locations.nginx.conf /etc/nginx/locations.nginx.conf
nginx