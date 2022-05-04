import { AuthMiddleware } from '@voiceflow/socket-utils';

import type { LoguxControlOptions } from '../control';

const buildMiddlewares = (options: LoguxControlOptions) => ({
  auth: new AuthMiddleware(options),
});

export default buildMiddlewares;

export type MiddlewareMap = ReturnType<typeof buildMiddlewares>;
