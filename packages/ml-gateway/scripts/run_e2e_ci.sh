#!/bin/bash

# this script is used to initialize this service for e2e tests targeting this monorepo

SERVICE_NAME="ml-gateway"
IMAGE_NAME="vf-local/${SERVICE_NAME}:e2e"
PORT=8015

set -e

cp ../../yarn.lock .

docker build \
  --build-arg build_REGISTRY_URL=http://localhost:4873 \
  --build-arg build_BUILD_NUM=${CIRCLE_BUILD_NUM} \
  --build-arg build_BUILD_URL=${CIRCLE_BUILD_URL}	\
  --build-arg build_GIT_SHA=${CIRCLE_SHA1} \
  --build-arg build_SEM_VER=${SEM_VER} \
  --network host \
  -f Dockerfile.e2e \
  -t ${IMAGE_NAME} .

docker run \
  --expose ${PORT} \
  --publish ${PORT}:${PORT} \
  --name ${SERVICE_NAME}-e2e \
  --hostname ${SERVICE_NAME}.test.e2e \
  --network vf_voiceflow \
  --volume vf_certs:/target/certs \
  --volume vf_caroot:/usr/local/share/ca-certificates \
  ${IMAGE_NAME}
