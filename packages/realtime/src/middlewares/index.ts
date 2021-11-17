import type { LoguxControlOptions } from '../control';
import AuthMiddleware from './auth';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildMiddlewares = (options: LoguxControlOptions) => ({
  auth: new AuthMiddleware(options),
});

export default buildMiddlewares;

export type MiddlewareMap = ReturnType<typeof buildMiddlewares>;
