import './polyfills';

import path from 'path';
import { fileURLToPath } from 'url';

import config from './config';
import logger from './logger';
import Server from './server';
import ServiceManager from './serviceManager';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

(async () => {
  const server = new Server({ cwd: rootDir, config, logger });
  const serviceManager = new ServiceManager({ server, config });

  // Graceful shutdown from SIGTERM
  process.on('SIGTERM', async () => {
    logger.warn('SIGTERM received stopping server...');

    await serviceManager.stop();
    await server.stop();
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });

  process.on('unhandledRejection', (r, p) => {
    logger.warn(`${r} Unhandled rejection at: ${p}`);
  });

  try {
    await serviceManager.start();
    await server.start();
  } catch (e) {
    logger.error('Failed to start server');
    logger.error(e);
  }
})();
