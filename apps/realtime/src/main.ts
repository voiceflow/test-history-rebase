import './tracer';

import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Environment } from '@voiceflow/common';
import { configureApp, corsConfig, LoggerPlugin } from '@voiceflow/nestjs-common';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { LoguxFactory } from '@voiceflow/nestjs-logux';
import { enablePatches, setAutoFreeze } from 'immer';

import type { EnvironmentVariables } from './app.env';
import { AppModule } from './app.module';
import { appRef } from './app.ref';

async function bootstrap() {
  const startTime = performance.now();

  const isE2E = process.env.NODE_ENV === Environment.E2E;

  const __dirname = isE2E ? path.dirname(fileURLToPath(import.meta.url)) : '';

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsConfig(isE2E),
    bufferLogs: true,
    httpsOptions: isE2E
      ? {
          key: fs.readFileSync(path.resolve(__dirname, '../certs/localhost.key')),
          cert: fs.readFileSync(path.resolve(__dirname, '../certs/localhost.crt')),
        }
      : undefined,
  });

  app.useBodyParser('json', { limit: '15mb' });

  LoguxFactory.connectMicroservice(app);

  enablePatches();
  setAutoFreeze(false);
  configureApp(app, { plugins: [LoggerPlugin()] });

  // trust proxy to access the real ip address
  app.set('trust proxy', true);

  appRef.current = app;

  await app.init();

  await app.startAllMicroservices();

  await app.listen(app.get<EnvironmentVariables>(ENVIRONMENT_VARIABLES).PORT_HTTP);

  const log = new Logger(bootstrap.name);

  process.on('SIGTERM', () => {
    log.warn('SIGTERM received stopping server...');
  });

  log.log(`Listening on port ${app.get<EnvironmentVariables>(ENVIRONMENT_VARIABLES).PORT_HTTP}`);
  log.log(`Service took ${Math.round(performance.now() - startTime)}ms to start`);
}
bootstrap();
