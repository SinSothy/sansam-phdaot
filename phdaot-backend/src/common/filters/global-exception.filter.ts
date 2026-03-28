import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errors = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      
      // Handle ValidationPipe errors
      if (typeof res === 'object' && (res as any).message && Array.isArray((res as any).message)) {
        message = 'Validation failed';
        errors = (res as any).message.map((msg: string) => {
          // ValidationPipe formats messages like "field must be a valid email"
          // We can try to extract the field name
          const firstSpaceIndex = msg.indexOf(' ');
          const field = firstSpaceIndex !== -1 ? msg.substring(0, firstSpaceIndex) : 'unknown';
          return { field, detail: msg };
        });
      } else {
        message = typeof res === 'object' ? (res as any).message || JSON.stringify(res) : res;
      }
      
      errorCode = this.mapStatusToGoogleCode(status);
    } else {
      console.error(exception);
    }

    response.status(status).json({
      status: 'error',
      message: message,
      code: status,
      data: null,
      errors: errors,
      meta: {
        timestamp: new Date().toISOString(),
        requestID: request.body?.header?.requestID,
      },
    });
  }

  private mapStatusToGoogleCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST: return 'INVALID_ARGUMENT';
      case HttpStatus.UNAUTHORIZED: return 'UNAUTHENTICATED';
      case HttpStatus.FORBIDDEN: return 'PERMISSION_DENIED';
      case HttpStatus.NOT_FOUND: return 'NOT_FOUND';
      case HttpStatus.CONFLICT: return 'ALREADY_EXISTS';
      default: return 'INTERNAL_SERVER_ERROR';
    }
  }
}
