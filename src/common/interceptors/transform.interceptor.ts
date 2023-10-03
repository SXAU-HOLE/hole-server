import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      
      map((data) => {
        if(typeof data === 'object') {
          if(data.message) {
            const {message,...other} = data
            
            return {
              data: other,
              message: message,
              code: 200
            }
          }
        } else {
          return {
            data,
            message: '请求成功',
            code: 200
          }
        }
      }),
    );
  }
}
