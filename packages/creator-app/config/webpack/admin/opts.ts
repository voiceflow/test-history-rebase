/* eslint-disable no-process-env */

import { Options } from '@voiceflow/webpack-config';
import fs from 'fs';
import path from 'path';

import env from '../env';

const { E2E, NODE_ENV } = process.env;

const rootDir = path.resolve(__dirname, '../../..');

const opts: Options = {
  name: 'Voiceflow Admin',

  mode: NODE_ENV === 'production' ? 'production' : 'development',

  env,

  rootDir,
  paths: {
    tsconfig: 'tsconfig.build.json',
    entrypoint: 'src/admin/index.tsx',
    buildDir: 'admin_build/',
  },

  output: {
    version: env.VERSION,
  },

  serve: {
    port: 3001,
    publicURL: 'admin-local.development.voiceflow.com:3003',
    https: E2E
      ? {
          key: fs.readFileSync(path.join(rootDir, 'certs/localhost.key')),
          cert: fs.readFileSync(path.join(rootDir, 'certs/localhost.crt')),
        }
      : undefined,
  },
};

export default opts;
