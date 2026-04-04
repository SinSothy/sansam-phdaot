import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: string;
  message: string;
  error: null;
  data: T;
  meta: {
    timestamp: string;
    requestID?: string;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    // Safely extract requestID from either body or query
    const requestID = request.body?.header?.requestID || request.query?.requestID;

    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        message: 'Operation successful',
        error: null,
        data: data ?? null,
        meta: {
          timestamp: new Date().toISOString(),
          requestID: requestID ? String(requestID) : undefined,
        },
      })),
    );
  }
}
