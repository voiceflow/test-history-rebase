import './polyfills';

import { SocketServer } from '@voiceflow/socket-utils';
import { inspect } from 'node:util';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config';
import logger from './logger';
import ServiceManager from './serviceManager';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

(async () => {
  const server = new SocketServer({
    port: config.PORT,
    env: config.NODE_ENV,
    cwd: rootDir,
    logger,
  });
  const serviceManager = new ServiceManager({ server, config, log: logger });

  // Graceful shutdown from SIGTERM
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received stopping server...');

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
    server.on('fatal', (error) => logger.error({ error }));
    server.on('error', (error, action, meta) => logger.warn({ error, action, meta }));

    await serviceManager.start();
    await server.start();
  } catch (e) {
    logger.error('Failed to start server');
    logger.error(e);
  }
})();
