#!/bin/bash

mkcert -install

rm -rf certs/
mkdir -p certs/ && cd certs/
LAN_IP=$(ifconfig en0 | grep "inet " | awk '{print $2}' | sed 's/addr://');
echo "LAN IP: $LAN_IP"
mkcert localhost 127.0.0.1 ::1 $(echo "$(hostname)" | tr '[:upper:]' '[:lower:]') $(hostname) $LAN_IP creator-local.development.voiceflow.com *.test.e2e;

# Rename certificate and key
mv *-key.pem localhost.key
mv *.pem localhost.crt

# Merge into a pem
cp localhost.key server.test.pem
cat localhost.crt >> server.test.pem
