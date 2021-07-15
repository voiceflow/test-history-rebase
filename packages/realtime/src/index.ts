import './polyfills';

import path from 'path';
import { fileURLToPath } from 'url';

import actions from './actions';
import auth from './auth';
import channels from './channels';
import config from './config';
import log from './logger';
import Server from './server';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

(async () => {
  const server = new Server(rootDir, log, config);

  server.use(auth);
  server.use(channels);
  server.use(actions);

  // Graceful shutdown from SIGTERM
  process.on('SIGTERM', async () => {
    log.warn('SIGTERM received stopping server...');

    server.stop();
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });

  process.on('unhandledRejection', (r, p) => {
    log.warn(`${r} Unhandled rejection at: ${p}`);
  });

  try {
    await server.start();
  } catch (e) {
    log.error('Failed to start server');
    log.error(e);
  }
})();
