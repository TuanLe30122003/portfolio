import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { setupApp } from './app.setup.js';
import type { EnvironmentVariables } from './config/env.validation.js';

async function bootstrap() {
  const app = setupApp(await NestFactory.create(AppModule));
  const port = app
    .get<ConfigService<EnvironmentVariables, true>>(ConfigService)
    .get('PORT', { infer: true });

  await app.listen(port);
  Logger.log(`API ready at http://localhost:${port}/api`, 'Bootstrap');
}
// Not a top-level await: on Vercel, the runtime intercepts `listen()` to grab
// the server and never calls it back, so awaiting here would keep this module
// from ever finishing loading (every request would hang).
void bootstrap();
