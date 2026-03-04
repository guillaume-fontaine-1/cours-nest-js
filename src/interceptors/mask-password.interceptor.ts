import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class MaskPasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (data && typeof data === 'object') {
          if (Array.isArray(data)) {
            return data.map((item) => this.maskPassword(item));
          }
          return this.maskPassword(data);
        }
        return data;
      }),
    );
  }

  private maskPassword(user: any): any {
    if (user && user.password) {
      return {
        ...user,
        password: '********',
      };
    }
    return user;
  }
}
