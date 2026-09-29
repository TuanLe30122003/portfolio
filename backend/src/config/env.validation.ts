import { plainToInstance, Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

/** Empty strings in .env (e.g. `NOTION_TOKEN=`) are treated as "not set". */
const emptyToUndefined = () =>
  Transform(({ value }: { value: unknown }) =>
    value === '' ? undefined : value,
  );

export class EnvironmentVariables {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test' = 'development';

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 4000;

  /** Comma-separated list of origins allowed to call the API. */
  @IsString()
  CORS_ORIGIN: string = 'http://localhost:3000';

  /** Notion internal integration secret. When missing, the API serves mock posts. */
  @IsOptional()
  @IsString()
  @emptyToUndefined()
  NOTION_TOKEN?: string;

  /** Database ID or full database URL (resolved to its first data source). */
  @IsOptional()
  @IsString()
  @emptyToUndefined()
  NOTION_DATABASE_ID?: string;

  /** Optional: skip the lookup above by providing the data source ID directly. */
  @IsOptional()
  @IsString()
  @emptyToUndefined()
  NOTION_DATA_SOURCE_ID?: string;

  /**
   * Keep this well under 1 hour: Notion-hosted file URLs (covers, images)
   * are signed and expire ~1 hour after the API returns them.
   */
  @IsInt()
  @Min(0)
  @Max(3000)
  CACHE_TTL_SECONDS: number = 300;

  /** Shared secret for POST /api/blog/revalidate (also set in the frontend). */
  @IsOptional()
  @IsString()
  @emptyToUndefined()
  REVALIDATE_SECRET?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated);
  if (errors.length > 0) {
    throw new Error(
      `Invalid environment variables:\n${errors.map((e) => `  - ${Object.values(e.constraints ?? {}).join(', ')}`).join('\n')}`,
    );
  }
  return validated;
}
