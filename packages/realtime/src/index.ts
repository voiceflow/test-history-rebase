import './polyfills';

import { LoguxError } from '@logux/core';
import { SocketServer } from '@voiceflow/socket-utils';
import { inspect } from 'node:util';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config';
import IOServer from './ioServer';
import logger from './logger';
import ServiceManager from './serviceManager';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

(async () => {
  const server = new SocketServer({
    env: config.NODE_ENV,
    port: config.PORT,
    cwd: rootDir,
    // errors handled by server.on('error', ...) below
    logger: Object.assign(logger, { error: logger.debug }),
  });

  const ioServer = new IOServer({
    env: config.NODE_ENV,
    port: config.PORT_IO,
  });

  const serviceManager = new ServiceManager({ server, ioServer, config, log: logger });

  const gracefulShutdown = async () => {
    await serviceManager.stop();
    await ioServer.stop();
    await server.stop();

    // eslint-disable-next-line no-process-exit
    process.exit(0);
  };

  // Graceful shutdown from SIGTERM
  process.on('SIGTERM', async () => {
    logger.warn('SIGTERM received stopping server...');

    await gracefulShutdown();
  });

  process.on('unhandledRejection', async (r, p) => {
    logger.warn(`${r} Unhandled rejection at: ${inspect(p)}`);

    await gracefulShutdown();
  });

  try {
    server.on('fatal', (error) => logger.error({ error }));
    server.on('error', (error, action, meta) => {
      if (error instanceof LoguxError && error.type === 'timeout') {
        logger.info({ error, action, meta });
      } else {
        logger.warn({ error, action, meta });
      }
    });
    ioServer.on('error', (error) => error && logger.warn({ error }));
    ioServer.on('fatal', (error) => error && logger.error({ error }));

    await serviceManager.start();
    await ioServer.start();
    await server.start();
  } catch (e) {
    logger.error('Failed to start server');
    logger.error(e);

    await gracefulShutdown();
  }
})();
