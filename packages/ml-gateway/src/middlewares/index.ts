import type { LoguxControlOptions } from '../control';
import AuthMiddleware from './auth';

const buildMiddlewares = (options: LoguxControlOptions) => ({
  auth: new AuthMiddleware(options),
});

export default buildMiddlewares;

export type MiddlewareMap = ReturnType<typeof buildMiddlewares>;
