import type { IOControlOptions } from '../../control';
import AuthMiddleware from './auth';

const buildMiddlewares = (options: IOControlOptions) => ({
  auth: new AuthMiddleware(options),
});

export default buildMiddlewares;

export type MiddlewareMap = ReturnType<typeof buildMiddlewares>;
