import type { LoguxControlOptions } from '../control';
import AuthMiddleware from './auth';

export type MiddlewareMap = ReturnType<typeof buildMiddlewares>;

const buildMiddlewares = (options: LoguxControlOptions) => ({
  auth: new AuthMiddleware(options),
});

export default buildMiddlewares;
