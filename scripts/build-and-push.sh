#!/usr/bin/env bash
set -e

if [ -z ${CIRCLE_BUILD_NUM} ]; then VERSION=$(cat package.json | jq .version -r);
else VERSION=$CIRCLE_BUILD_NUM;
fi

NAME=creator

echo "Building and pushing ${NAME}:${VERSION}"

docker pull node:11

NPM_TOKEN=$(cat ~/.npmrc | grep '//registry.npmjs.org')
echo "docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t voiceflow/${NAME}:${VERSION} ."
docker build --build-arg NPM_TOKEN=${NPM_TOKEN} --squash -t voiceflow/${NAME}:${VERSION} .
docker push voiceflow/${NAME}:${VERSION}
