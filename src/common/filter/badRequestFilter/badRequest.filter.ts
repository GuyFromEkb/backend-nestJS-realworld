import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";

/**
 * @description - Фильтр для ВСЕГО Приложения что бы сделать формат ошибок {errors:{body: ....}}
 *
 * @example:
 * @Module({
 *   imports: [TagModule, UserModule],
 *   controllers: [AppController],
 *   providers: [
 *     AppService,
 *     {
 *       provide: APP_FILTER,
 *       useClass: BadRequestFilter,
 *     },
 *   ],
 * })
 * */
@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as { message: string[] };

    response.status(status).json({
      errors: {
        body: exceptionResponse.message,
      },
    });
  }
}
