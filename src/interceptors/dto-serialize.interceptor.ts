import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

export class SerializeInterceptor<T extends Record<string, any>, R extends Record<string, any>> implements NestInterceptor<T, R | R[]> {
  constructor(private dto: new () => R) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<R | R[]> {
    return next.handle().pipe(
      map((data: T | T[]) => {
        if (Array.isArray(data)) {
          return data.map((item: T) => plainToInstance(this.dto, item));
        }
        return plainToInstance(this.dto, data, {
            excludeExtraneousValues : true
        });
      }),
    );
  }
}
