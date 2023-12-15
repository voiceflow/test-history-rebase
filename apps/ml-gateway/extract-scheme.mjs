// should be your first require
import { resolve } from 'node:path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { extractSchema } from '@voiceflow/nestjs-openapi-extractor/build/esm/main.js';

const projectRoot = process.cwd();
const appModulePath = resolve(projectRoot, 'build/app.module.js');
const appDocumentationPath = resolve(projectRoot, 'build/app.doc.js');

extractSchema({
  output: 'openapi.next.json',
  appModule: appModulePath,
  appDocumentation: appDocumentationPath,
});
