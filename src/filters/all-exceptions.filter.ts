import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
    catch(exception: unknown, host: ArgumentsHost): void {
      const { httpAdapter } = this.httpAdapterHost;
  
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      // Kiểm tra nếu lỗi là HttpException, nếu không thì trả Internal Server Error
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: request.url,
        message:
          exception instanceof HttpException
            ? exception.getResponse()
            : 'Internal server error',
      };
  
      // Gửi response JSON
      httpAdapter.reply(response, responseBody, httpStatus);
    }
  }
  