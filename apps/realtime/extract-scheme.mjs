// should be your first require
import { resolve } from 'node:path';

import { extractSchema } from '@voiceflow/nestjs-openapi-extractor/build/esm/main.js';
// import log from 'why-is-node-running';

const projectRoot = process.cwd();
const appModulePath = resolve(projectRoot, 'build/app.module.js');
const appDocumentationPath = resolve(projectRoot, 'build/app.doc.js');

extractSchema({
  output: 'openapi.next.json',
  appModule: appModulePath,
  appDocumentation: appDocumentationPath,
});

// setTimeout(function () {
//   log(); // logs out active handles that are keeping node running
// }, 5000);

// setTimeout(function () {
//   console.log('---------->');
//   log(); // logs out active handles that are keeping node running
// }, 10000);
