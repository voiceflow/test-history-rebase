#!/bin/bash

cp ~/.story/env.dev /srv/storyflow-creator

cd /srv/storyflow-creator

forever start -c "npm run unsecure" .
