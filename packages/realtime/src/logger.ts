import { Logger, LogLevel, MiddlewareVerbosity } from '@voiceflow/logger';

import config from './config';

const log = new Logger({
  level: config.LOG_LEVEL as LogLevel,
  pretty: ['local', 'test', 'e2e'].includes(config.NODE_ENV || ''),
  middlewareVerbosity: config.MIDDLEWARE_VERBOSITY as MiddlewareVerbosity,
});

export default log;
