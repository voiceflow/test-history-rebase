#!/bin/bash

cp ~/.store/.env /srv/storyflow-creator

cd /srv/storyflow-creator

forever start -c "npm run start" .
