// import './polyfills';
// import './tracer';

// import { inspect } from 'node:util';

// import { LoguxError } from '@logux/core';
// import * as Realtime from '@voiceflow/realtime-sdk';
// import { serializeError, SocketServer } from '@voiceflow/socket-utils';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import IOServer from './ioServer';
// import logger, { createLogger } from './logger';
// import config from './old_config';
// import ServiceManager from './serviceManager';

// const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// (async () => {
//   const serverLogger = createLogger();
//   const server = new SocketServer({
//     cwd: rootDir,
//     env: config.NODE_ENV,
//     port: config.PORT,

//     supports: `>=${Realtime.Subprotocol.Version.V1_0_0}`,
//     subprotocol: Realtime.Subprotocol.CURRENT_VERSION,

//     // errors handled by server.on('error', ...) below
//     logger: Object.assign(serverLogger, { error: serverLogger.debug }),
//   });

//   const ioServer = new IOServer({
//     env: config.NODE_ENV,
//     port: config.PORT_IO,
//   });

//   const serviceManager = new ServiceManager({ server, ioServer, config, log: logger });

//   const gracefulShutdown = async () => {
//     await ioServer.stop();
//     await server.stop();
//     await serviceManager.stop();

//     // eslint-disable-next-line no-process-exit
//     process.exit(0);
//   };

//   // Graceful shutdown from SIGTERM
//   process.on('SIGTERM', async () => {
//     logger.warn('SIGTERM received stopping server...');

//     await gracefulShutdown();
//   });

//   process.on('unhandledRejection', async (r, p) => {
//     logger.error(`${r} Unhandled rejection at: ${inspect(p)}`);
//   });

//   try {
//     server.on('fatal', (error) => logger.error({ message: error.message, error: serializeError(error) }));
//     server.on('error', (error, action, meta) => {
//       if (error instanceof LoguxError && error.type === 'timeout') {
//         logger.info({ message: error.message, error: serializeError(error), action, meta });
//       } else {
//         logger.warn({ message: error.message, error: serializeError(error), action, meta });
//       }
//     });
//     ioServer.on('error', (error) => error && logger.warn({ error }));
//     ioServer.on('fatal', (error) => error && logger.error({ error }));

//     await serviceManager.start();
//     await ioServer.start();
//     await server.start();
//   } catch (e) {
//     logger.error('Failed to start server');
//     logger.error(e);

//     await gracefulShutdown();
//   }
// })();
