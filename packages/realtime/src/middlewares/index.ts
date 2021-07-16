import type { LoguxControlOptions } from '../control';
import AuthMiddleware from './auth';

export type MiddlewareMap = {
  auth: AuthMiddleware;
};

const buildMiddlewares = (options: LoguxControlOptions): MiddlewareMap => ({
  auth: new AuthMiddleware(options),
});

export default buildMiddlewares;
