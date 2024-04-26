import type { Logger, LogLevel } from '@voiceflow/logger';
import { createLogger as createVFLogger, LogFormat } from '@voiceflow/logger';

export const createLogger = (env: string, level: LogLevel): Logger =>
  createVFLogger({
    level,
    format: ['local', 'test', 'e2e'].includes(env || '') ? LogFormat.DETAILED : LogFormat.JSON,
  });
