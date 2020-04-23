#!/bin/bash

# Inject any variables prefixed with "VF_OVERRIDE_" into the global window object

echo "" >> /var/www/static.js # add newline

overrides=$(echo ${!VF_OVERRIDE_*})
for envvar in $overrides
do
  envval=$(echo -e "${!envvar}")
  replaceStr=$(echo "window.$envvar=\"$envval\";" )
  echo "Override variable: $replaceStr"
  echo $replaceStr >> /var/www/static.js
done

nginx -g "daemon off;"
