import { createLogger as createVFLogger, LogFormat, Logger, LogLevel } from '@voiceflow/logger';

import config from './config';

export const createLogger = (): Logger =>
  createVFLogger({
    level: config.LOG_LEVEL as LogLevel,
    format: ['local', 'test', 'e2e'].includes(config.NODE_ENV || '') ? LogFormat.DETAILED : LogFormat.JSON,
  });

const log = createLogger();

export default log;
