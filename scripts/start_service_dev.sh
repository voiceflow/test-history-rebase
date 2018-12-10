#!/bin/bash

cd /srv/storyflow-creator

forever start -c "npm run unsecure" .
