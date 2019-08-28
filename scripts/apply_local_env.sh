#!/bin/bash
touch .env.local 
grep -q "VF_APP_API_HOST" .env.local
if [ $? == 0 ]; then 
  sed -i '' '/VF_APP_API_HOST=*/d' .env.local
fi
echo -e "VF_APP_API_HOST=localhost" >> .env.local

echo "INFO: .env.local file updated!"