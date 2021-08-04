import { Options } from '@voiceflow/webpack-config';
import fs from 'fs';
import path from 'path';

import env from './env';

const { E2E, NODE_ENV } = process.env;

const rootDir = path.resolve(__dirname, '../..');

const opts: Options = {
  name: 'Voiceflow Admin',

  mode: NODE_ENV === 'production' ? 'production' : 'development',

  env,

  rootDir,
  paths: {
    tsconfig: 'tsconfig.build.json',
    entrypoint: 'src/index.tsx',
    buildDir: 'build/',
  },

  output: {
    version: env.VERSION,
  },

  serve: {
    port: 3001,
    publicURL: 'https://admin-local.development.voiceflow.com:3003',

    ...(E2E && {
      port: 3003,
      https: {
        key: fs.readFileSync(path.join(rootDir, 'certs/localhost.key')),
        cert: fs.readFileSync(path.join(rootDir, 'certs/localhost.crt')),
      },
    }),
  },
};

export default opts;
