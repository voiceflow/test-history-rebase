import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Environment } from '@voiceflow/common';
import { configureApp, LoggerPlugin } from '@voiceflow/nestjs-common';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { LoguxFactory } from '@voiceflow/nestjs-logux';

import type { EnvironmentVariables } from './app.env';
import { AppModule } from './app.module';

async function bootstrap() {
  const startTime = performance.now();

  const isE2E = process.env.NODE_ENV === Environment.E2E;

  const __dirname = isE2E ? path.dirname(fileURLToPath(import.meta.url)) : '';

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: isE2E ? true : { origin: [/\.voiceflow\.com$/, 'https://creator-local.development.voiceflow.com:3002'] },
    httpsOptions: isE2E
      ? {
          key: fs.readFileSync(path.resolve(__dirname, '../certs/localhost.key')),
          cert: fs.readFileSync(path.resolve(__dirname, '../certs/localhost.crt')),
        }
      : undefined,
  });

  LoguxFactory.connectMicroservice(app);

  configureApp(app, { plugins: [LoggerPlugin()] });

  await app.init();

  await app.startAllMicroservices();

  await app.listen(app.get<EnvironmentVariables>(ENVIRONMENT_VARIABLES).PORT_HTTP);

  new Logger(bootstrap.name).log(`Service took ${Math.round(performance.now() - startTime)}ms to start`);
}
bootstrap();
