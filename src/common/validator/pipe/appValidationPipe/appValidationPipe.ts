import { HttpStatus, Injectable, ValidationPipe, ValidationPipeOptions } from "@nestjs/common";
import { ValidationError } from "class-validator";

import { AppHttpException } from "~common/error";

@Injectable()
export class AppValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      whitelist: options?.whitelist ?? true,
      exceptionFactory: (errors) => {
        const messages = this.processErrors(errors);
        return new AppHttpException(messages, HttpStatus.BAD_REQUEST);
      },
    });
  }

  private processErrors(errors: ValidationError[], path = ""): string[] {
    return errors.flatMap((error) => this.createErrorMessages(error, path));
  }

  private createErrorMessages(error: ValidationError, path: string): string[] {
    const newPath = path ? `${path}.${error.property}` : error.property;
    const hasChildren = error.children && error.children.length > 0;
    if (hasChildren) {
      return this.processErrors(error.children!, newPath);
    }
    return [this.createErrorMessage(newPath, error)];
  }

  private createErrorMessage(path: string, error: ValidationError): string {
    const constraints = Object.values(error.constraints ?? {}).join(", ");
    //если объект вложенный без этой проверки будет вывод: [object object]
    if (typeof error.value !== "string") return `${path} has wrong value: ${constraints}`;

    return `${path} has wrong value - ${String(error.value)}: ${constraints}`;
  }
}
