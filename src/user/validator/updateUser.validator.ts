import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

import { AppHttpException } from "~common/error";

Injectable();
export class ValidatePayloadExistsPipe implements PipeTransform {
  transform(payload: any): any {
    if (!Object.keys(payload).length) {
      throw new AppHttpException("Payload should not be empty", HttpStatus.BAD_REQUEST);
    }

    return payload;
  }
}
