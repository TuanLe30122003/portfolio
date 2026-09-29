import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RevalidateSecretGuard } from '../common/guards/revalidate-secret.guard.js';
import { BlogService } from './blog.service.js';
import { ListPostsQueryDto } from './dto/list-posts.query.dto.js';

@Controller('blog')
export class BlogController {
  constructor(private readonly blog: BlogService) {}

  /** GET /api/blog/posts?tag=&cursor=&limit= */
  @Get('posts')
  listPosts(@Query() query: ListPostsQueryDto) {
    return this.blog.listPosts(query);
  }

  /** GET /api/blog/posts/:slug */
  @Get('posts/:slug')
  getPost(@Param('slug') slug: string) {
    return this.blog.getPost(slug);
  }

  /** GET /api/blog/tags */
  @Get('tags')
  listTags() {
    return this.blog.listTags();
  }

  /** POST /api/blog/revalidate (header: x-revalidate-secret) — drops cached Notion data. */
  @Post('revalidate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RevalidateSecretGuard)
  revalidate() {
    return this.blog.purgeCache();
  }
}
