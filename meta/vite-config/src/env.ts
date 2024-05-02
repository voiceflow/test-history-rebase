import dotenv from 'dotenv';
import fs from 'fs';
import branch from 'git-branch';
import path from 'path';

import { APP_ENV_PREFIX, OVERRIDE_ENV_PREFIX } from './constants';
import type { Env } from './types';

export const defineEnv = (extendEnv: (env: Env) => { defaults: Env; overrides: Env }) => (): Env => {
  const environment = process.env.VF_APP_BUILD_ENV || 'local';

  const envPostfix = environment ? `.${environment}` : '';
  const envFile = path.resolve(process.cwd(), `.env${envPostfix}`);

  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }

  dotenv.config();

  const { env } = process;

  const { APP_ENV, NODE_ENV, E2E, CIRCLE_TAG, CIRCLE_SHA1, SOURCE_MAPS, CIRCLE_BRANCH } = env;

  const extractedEnvs = Object.keys(env).reduce<Record<string, string | undefined>>((acc, key) => {
    if (key.startsWith(APP_ENV_PREFIX)) {
      acc[key.replace(APP_ENV_PREFIX, '')] = env[key];
    } else if (key.startsWith(OVERRIDE_ENV_PREFIX)) {
      acc[key] = env[key];
    }

    return acc;
  }, {});

  const extended = extendEnv(extractedEnvs);

  return {
    APP_ENV: APP_ENV || 'local',
    NODE_ENV,
    E2E,
    SOURCE_MAPS,

    ...extended.defaults,
    ...extractedEnvs,

    VERSION: extractedEnvs.VERSION || CIRCLE_TAG || `(${CIRCLE_BRANCH || CIRCLE_SHA1 || branch.sync()})`,

    ...extended.overrides,
  };
};
