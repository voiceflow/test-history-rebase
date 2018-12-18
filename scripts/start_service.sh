#!/bin/bash

cp ~/.story/.env /srv/storyflow-creator

cd /srv/storyflow-creator

forever start -c "npm run start" .
