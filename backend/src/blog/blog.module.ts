import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Client } from '@notionhq/client';
import type { EnvironmentVariables } from '../config/env.validation.js';
import { NOTION_CLIENT, NotionModule } from '../notion/notion.module.js';
import { BlogController } from './blog.controller.js';
import { BlogService } from './blog.service.js';
import { MockPostsRepository } from './repositories/mock-posts.repository.js';
import { NotionPostsRepository } from './repositories/notion-posts.repository.js';
import { PostsRepository } from './repositories/posts.repository.js';

@Module({
  imports: [NotionModule],
  controllers: [BlogController],
  providers: [
    BlogService,
    {
      provide: PostsRepository,
      inject: [NOTION_CLIENT, ConfigService],
      useFactory: (
        notion: Client | null,
        config: ConfigService<EnvironmentVariables, true>,
      ): PostsRepository => {
        if (!notion) {
          new Logger('BlogModule').warn(
            'NOTION_TOKEN is not set — serving mock posts',
          );
          return new MockPostsRepository();
        }
        return new NotionPostsRepository(notion, {
          databaseId: config.get('NOTION_DATABASE_ID', { infer: true }),
          dataSourceId: config.get('NOTION_DATA_SOURCE_ID', { infer: true }),
        });
      },
    },
  ],
})
export class BlogModule {}
