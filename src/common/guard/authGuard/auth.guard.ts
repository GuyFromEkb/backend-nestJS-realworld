import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

import { AppHttpException } from "~common/errors";
import { IAppRequest } from "~common/type";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IAppRequest = context.switchToHttp().getRequest();

    if (!request.user) throw new AppHttpException("Unauthorized", HttpStatus.UNAUTHORIZED);

    return true;
  }
}
