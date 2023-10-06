import './polyfills';

import { inspect } from 'node:util';

import { LoguxError } from '@logux/core';
import { serializeError, SocketServer } from '@voiceflow/socket-utils';
import path from 'path';
import { fileURLToPath } from 'url';

import { ApiManager } from './api';
import config from './config';
import logger, { createLogger } from './logger';
import ServiceManager from './serviceManager';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

(async () => {
  const serverLogger = createLogger();

  const server = new SocketServer({
    port: config.PORT,
    env: config.NODE_ENV,
    cwd: rootDir,
    timeout: config.LOGUX_TIMEOUT,

    // errors handled by server.on('error', ...) below
    logger: Object.assign(serverLogger, { error: serverLogger.debug }),
  });

  const serviceManager = new ServiceManager({ server, config, log: logger });
  const apiManager = new ApiManager(serviceManager);

  server.http(apiManager.start());

  // Graceful shutdown from SIGTERM
  process.on('SIGTERM', async () => {
    logger.warn('SIGTERM received stopping server...');

    await serviceManager.stop();
    await server.stop();
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });

  process.on('unhandledRejection', async (r, p) => {
    logger.warn(`${r} Unhandled rejection at: ${inspect(p)}`);

    await serviceManager.stop();
    await server.stop();

    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });

  try {
    server.on('fatal', (error) => logger.error({ message: error.message, error: serializeError(error) }));
    server.on('error', (error, action, meta) => {
      if (error instanceof LoguxError && error.type === 'timeout') {
        logger.info({ message: error.message, error: serializeError(error), action, meta });
      } else {
        logger.warn({ message: error.message, error: serializeError(error), action, meta });
      }
    });

    await serviceManager.start();
    await server.start();
  } catch (e) {
    logger.error('Failed to start server');
    logger.error(e);
  }
})();
