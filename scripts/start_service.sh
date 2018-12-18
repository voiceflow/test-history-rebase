#!/bin/bash

cp ~/.story/env.prod /srv/storyflow-creator

cd /srv/storyflow-creator

forever start -c "npm run start" .
