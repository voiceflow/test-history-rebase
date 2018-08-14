npm prune
npm install
npm run-script build
rm -rf ../storyflow-server/creator/
cp -r ./build/ ../storyflow-server/creator/
