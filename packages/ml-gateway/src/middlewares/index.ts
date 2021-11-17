import type { LoguxControlOptions } from '../control';
import AuthMiddleware from './auth';

export type MiddlewareMap = ReturnType<typeof buildMiddlewares>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildMiddlewares = (options: LoguxControlOptions) => ({
  auth: new AuthMiddleware(options),
});

export default buildMiddlewares;
