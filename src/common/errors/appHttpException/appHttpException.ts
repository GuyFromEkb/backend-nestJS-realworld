import { HttpException } from "@nestjs/common";

export class AppHttpException extends HttpException {
  constructor(errors: string[] | string, statusCode: number) {
    super(
      {
        errors: {
          body: [...(Array.isArray(errors) ? errors : [errors])],
        },
      },
      statusCode,
    );
  }
}
