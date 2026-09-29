import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { Client, LogLevel } from '@notionhq/client';
import type { EnvironmentVariables } from '../config/env.validation.js';
import { NotionExceptionFilter } from './notion-exception.filter.js';

/** Injection token for the shared Notion client (`null` when NOTION_TOKEN is not set). */
export const NOTION_CLIENT = Symbol('NOTION_CLIENT');

@Module({
  providers: [
    {
      provide: NOTION_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => {
        const auth = config.get('NOTION_TOKEN', { infer: true });
        if (!auth) return null;

        // Route SDK logs (retries, request failures) through Nest's logger.
        const logger = new Logger('NotionClient');
        return new Client({
          auth,
          logLevel: LogLevel.WARN,
          logger: (level, message, extra) => {
            const line = `${message} ${JSON.stringify(extra)}`;
            if (level === LogLevel.ERROR) logger.error(line);
            else if (level === LogLevel.WARN) logger.warn(line);
            else logger.debug(line);
          },
        });
      },
    },
    { provide: APP_FILTER, useClass: NotionExceptionFilter },
  ],
  exports: [NOTION_CLIENT],
})
export class NotionModule {}
