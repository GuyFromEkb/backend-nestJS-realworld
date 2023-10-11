import { HttpStatus, Injectable, ValidationPipe } from "@nestjs/common";

import { AppHttpException } from "~common/errors";

@Injectable()
export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          return `${error.property} has wrong value - ${error.value}: ${Object.values(
            error.constraints ?? {},
          ).join(", ")}`;
        });

        return new AppHttpException(messages, HttpStatus.BAD_REQUEST);
      },
    });
  }
}
