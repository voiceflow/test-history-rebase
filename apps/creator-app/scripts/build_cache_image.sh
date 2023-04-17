#!/bin/bash

if [ -z $1 ]; then 
  echo -e "Please specify creator-app cache image version tag"
  exit 1
fi

TAG=cache-$1

# Get credentials
$(aws ecr get-login --no-include-email)

# Build and push
docker build --build-arg NPM_TOKEN=$(cat ~/.npmrc) -f cache.dockerfile . -t 168387678261.dkr.ecr.us-east-1.amazonaws.com/creator-app:$TAG
docker tag 168387678261.dkr.ecr.us-east-1.amazonaws.com/creator-app:$TAG 168387678261.dkr.ecr.us-east-1.amazonaws.com/creator-app:latest-cache
docker push 168387678261.dkr.ecr.us-east-1.amazonaws.com/creator-app:$TAG
docker push 168387678261.dkr.ecr.us-east-1.amazonaws.com/creator-app:latest-cache