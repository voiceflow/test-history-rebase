import { createLogger, LogFormat, LogLevel } from '@voiceflow/logger';

import config from './config';

const log = createLogger({
  level: config.LOG_LEVEL as LogLevel,
  format: ['local', 'test', 'e2e'].includes(config.NODE_ENV || '') ? LogFormat.DETAILED : LogFormat.JSON,
});

export default log;
