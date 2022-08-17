import { Logger, LogLevel, MiddlewareVerbosity } from '@voiceflow/logger';

import config from './config';

export const createLogger = () =>
  new Logger({
    level: config.LOG_LEVEL as LogLevel,
    pretty: ['local', 'test', 'e2e'].includes(config.NODE_ENV || ''),
    middlewareVerbosity: config.MIDDLEWARE_VERBOSITY as MiddlewareVerbosity,
  });

const log = createLogger();
export default log;
