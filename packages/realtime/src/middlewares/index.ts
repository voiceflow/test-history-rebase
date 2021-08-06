import type { LoguxControlOptions } from '../control';
import AuthMiddleware from './auth';

export interface MiddlewareMap {
  auth: AuthMiddleware;
}

const buildMiddlewares = (options: LoguxControlOptions): MiddlewareMap => ({
  auth: new AuthMiddleware(options),
});

export default buildMiddlewares;
