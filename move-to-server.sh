npm prune
npm install
npm run-script build
rm -rf ../storyflow-server/author/
cp -r ./build/ ../storyflow-server/author/
