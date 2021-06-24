/* eslint-disable no-process-env */

import { Options } from '@voiceflow/webpack-config';
import fs from 'fs';
import path from 'path';

import env from './env';

const { NODE_ENV, E2E } = process.env;

const rootDir = path.resolve(__dirname, '../..');

const opts: Options = {
  name: 'Voiceflow Creator',

  mode: NODE_ENV === 'production' ? 'production' : 'development',

  env,

  rootDir,
  paths: {
    tsconfig: 'tsconfig.build.json',
  },

  output: {
    version: env.VERSION,
  },

  serve: {
    port: 3000,
    publicURL: 'creator-local.development.voiceflow.com:3002',
    https: E2E
      ? {
          key: fs.readFileSync(path.join(rootDir, 'certs/localhost.key')),
          cert: fs.readFileSync(path.join(rootDir, 'certs/localhost.crt')),
        }
      : undefined,
  },
};

export default opts;
