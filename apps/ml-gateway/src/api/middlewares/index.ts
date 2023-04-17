import { Config } from '@/types';

import AuthMiddleware from './auth';
import BillingMiddleware from './billing';
import type { MiddlewareDependencies } from './utils';

export interface MiddlewaresMap {
  auth: AuthMiddleware;
  billing: BillingMiddleware;
}

const buildMiddleware = (config: Config, dependencies: MiddlewareDependencies) => {
  const middlewares = {} as MiddlewaresMap;

  middlewares.auth = new AuthMiddleware(config, dependencies);
  middlewares.billing = new BillingMiddleware(config, dependencies);

  return middlewares;
};

export default buildMiddleware;
