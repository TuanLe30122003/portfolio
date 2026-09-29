import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';
import { setupApp } from '../src/app.setup.js';
import { MockPostsRepository } from '../src/blog/repositories/mock-posts.repository.js';
import { PostsRepository } from '../src/blog/repositories/posts.repository.js';

describe('Blog API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      // Never hit Notion from tests, even if a local .env has a token.
      .overrideProvider(PostsRepository)
      .useValue(new MockPostsRepository())
      .compile();

    app = setupApp(moduleRef.createNestApplication()) as INestApplication<App>;
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health', () =>
    request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect(({ body }) => expect(body.status).toBe('ok')));

  it('GET /api/blog/posts paginates with a cursor', async () => {
    const first = await request(app.getHttpServer())
      .get('/api/blog/posts?limit=2')
      .expect(200);
    expect(first.body.items).toHaveLength(2);
    expect(first.body.items[0]).not.toHaveProperty('content');
    expect(first.body.nextCursor).toBe('2');

    const second = await request(app.getHttpServer())
      .get(`/api/blog/posts?limit=2&cursor=${first.body.nextCursor}`)
      .expect(200);
    expect(second.body.items).toHaveLength(1);
    expect(second.body.nextCursor).toBeNull();
  });

  it('GET /api/blog/posts filters by tag', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/blog/posts?tag=Notion')
      .expect(200);
    expect(body.items.map((p: { slug: string }) => p.slug)).toEqual([
      'notion-lam-cms',
    ]);
  });

  it('GET /api/blog/posts rejects invalid query params', () =>
    request(app.getHttpServer())
      .get('/api/blog/posts?limit=0&foo=bar')
      .expect(400));

  it('GET /api/blog/posts/:slug returns content', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/blog/posts/notion-lam-cms')
      .expect(200);
    expect(body.content).toContain('## Luồng dữ liệu');
    expect(body.readingTimeMinutes).toBeGreaterThan(0);
  });

  it('GET /api/blog/posts/:slug 404s for unknown slugs', () =>
    request(app.getHttpServer()).get('/api/blog/posts/nope').expect(404));

  it('GET /api/blog/tags', () =>
    request(app.getHttpServer())
      .get('/api/blog/tags')
      .expect(200)
      .expect(({ body }) => expect(body).toContain('Notion')));

  it('POST /api/blog/revalidate requires the secret', async () => {
    await request(app.getHttpServer()).post('/api/blog/revalidate').expect(401);
    await request(app.getHttpServer())
      .post('/api/blog/revalidate')
      .set('x-revalidate-secret', 'test-secret')
      .expect(204);
  });
});
