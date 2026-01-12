import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly logger: Logger
    ) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            data: null,
            meta: {
                timestamp: new Date().toISOString(),
                traceId: (ctx.getRequest() as any).headers?.['x-request-id'] || 'no-trace-id',
                path: httpAdapter.getRequestUrl(ctx.getRequest()),
            },
            error: {
                code: httpStatus,
                message:
                    exception instanceof HttpException
                        ? exception.getResponse()
                        : 'Internal Server Error',
            },
        };

        if (httpStatus >= 500) {
            this.logger.error(exception as Error, 'Unhandled Exception caught by Global Filter');
        } else {
            this.logger.warn({ err: exception }, 'HTTP Exception caught by Global Filter');
        }

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
