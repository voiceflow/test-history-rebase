#!/bin/bash

# Need to start the file server "sharing" to enable mDNS queries
# See https://discussions.apple.com/thread/7707202
sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.AppleFileServer.plist

touch .env.local 
grep -q "VF_APP_API_HOST" .env.local
if [ $? == 0 ]; then 
  sed -i '' '/APP_URL=*/d' .env.local
fi
echo -e "VF_APP_API_HOST=$(echo "$(hostname)" | tr '[:upper:]' '[:lower:]')" >> .env.local

echo "INFO: .env.local file updated!"