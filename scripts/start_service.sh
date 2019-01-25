#!/bin/bash

cp ~/.store/.env /srv/storyflow-creator

cd /srv/storyflow-creator
log_file_name="`date +%Y_%m_%d_%H_%M`.log"
forever start -l $log_file_name -c "npm run start" .
