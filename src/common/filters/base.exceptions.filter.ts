import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { isString } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error = isString(exceptionResponse)
      ? { message: exceptionResponse }
      : {
          code: (exceptionResponse as any).statusCode,
          message: (exceptionResponse as any).message,
          error: (exceptionResponse as any).error,
        };

    response.status(status).json({
      ...error,
      time: new Date().toISOString(),
    });
  }
}
