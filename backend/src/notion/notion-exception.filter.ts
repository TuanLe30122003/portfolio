import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  APIErrorCode,
  APIResponseError,
  RequestTimeoutError,
  UnknownHTTPResponseError,
} from '@notionhq/client';
import type { Response } from 'express';

type NotionError =
  APIResponseError | RequestTimeoutError | UnknownHTTPResponseError;

/**
 * Turns upstream Notion failures into gateway errors with an actionable
 * message, instead of leaking them as generic 500s.
 */
@Catch(APIResponseError, RequestTimeoutError, UnknownHTTPResponseError)
export class NotionExceptionFilter implements ExceptionFilter<NotionError> {
  private readonly logger = new Logger('Notion');

  catch(error: NotionError, host: ArgumentsHost) {
    const { status, message } = describe(error);
    this.logger.error(`${error.code}: ${error.message}`);

    host
      .switchToHttp()
      .getResponse<Response>()
      .status(status)
      .json({ statusCode: status, error: 'NotionError', message });
  }
}

function describe(error: NotionError): { status: number; message: string } {
  if (error instanceof RequestTimeoutError) {
    return {
      status: HttpStatus.GATEWAY_TIMEOUT,
      message: 'Notion did not respond in time',
    };
  }
  if (error instanceof APIResponseError) {
    switch (error.code) {
      case APIErrorCode.Unauthorized:
        return {
          status: HttpStatus.BAD_GATEWAY,
          message: 'Notion rejected NOTION_TOKEN',
        };
      case APIErrorCode.ObjectNotFound:
      case APIErrorCode.RestrictedResource:
        return {
          status: HttpStatus.BAD_GATEWAY,
          message:
            'Notion database not found — check NOTION_DATABASE_ID and share the database with your integration',
        };
      case APIErrorCode.RateLimited:
        return {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Notion rate limit reached, retry shortly',
        };
    }
  }
  return {
    status: HttpStatus.BAD_GATEWAY,
    message: 'Unexpected response from Notion',
  };
}
