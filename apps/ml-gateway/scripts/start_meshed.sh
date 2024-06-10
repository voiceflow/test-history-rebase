#!/bin/bash

if [[ $MESH_MODE == 'TELEPRESENCE' ]]; then
  GOOGLE_APPLICATION_CREDENTIALS=/tmp/voiceflow/ml-gateway/secrets/credentials.json;
fi
echo $GOOGLE_APPLICATION_CREDENTIALS

NODE_ENV=local IS_MESHED=true yarn dev
