import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

import { AppHttpException } from "~common/error";

/**
 * @description: Один из способов провалидировть, что в приходящем объекте есть хотя бы одно поле: https://stackoverflow.com/questions/64459543/nestjs-and-class-validator-at-least-one-field-should-not-be-empty
 * @example:
 * @Put("/user")
 * @UseGuards(AuthGuard)
 * @UsePipes(new validatePayloadExistsPipe())
 * async updateUser(@Body("user") user: UpdateUserDto, @User() user: TUser): Promise<IUserRes> {
 * return this.userService.buildUserResponse(user);
 * }
 */
Injectable();
export class ValidatePayloadExistsPipe implements PipeTransform {
  transform(payload: any, metadata: ArgumentMetadata): any {
    const isReqBody = metadata.type === "body";
    if (!isReqBody) return payload;

    const hasSomeValue = Object.values(payload).some(Boolean);
    if (!hasSomeValue) {
      throw new AppHttpException("Payload should not be empty", HttpStatus.BAD_REQUEST);
    }

    return payload;
  }
}
