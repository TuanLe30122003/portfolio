import { timingSafeEqual } from 'node:crypto';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { EnvironmentVariables } from '../../config/env.validation.js';

export const REVALIDATE_SECRET_HEADER = 'x-revalidate-secret';

@Injectable()
export class RevalidateSecretGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const secret = this.config.get('REVALIDATE_SECRET', { infer: true });
    if (!secret) {
      throw new ForbiddenException('REVALIDATE_SECRET is not configured');
    }

    const provided = context
      .switchToHttp()
      .getRequest<Request>()
      .header(REVALIDATE_SECRET_HEADER);

    if (!provided || !safeEqual(provided, secret)) {
      throw new UnauthorizedException('Invalid revalidate secret');
    }
    return true;
  }
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
