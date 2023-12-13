import { Request, Response, NextFunction } from 'express';
import { HttpError } from '$helpers/response';
import { ErrorCode, AccountStatus, ROLE } from '$enums/index';
import { promisify } from 'util';
import { verify } from 'jsonwebtoken';
import log from '$helpers/log';
import { getUserById } from '$services/user';
import fs from 'fs';
import path from 'path';
const logger = log('Middle ware check token');
const verifyAsync = promisify(verify) as any;
interface IDecodeToken {
  id: number;
  status: AccountStatus;
  type: 'userId';
  permissions: string[];
}

export function checkToken(req: Request, res: Response, next: NextFunction) {
  next();
  // let token = req.headers['authorization'] || '';
  // token = token.replace('Bearer ', '');
  // if (!token) {
  //   throw new HttpError(ErrorCode.Token_Not_Exist);
  // }

  // verifyAsync(token, process.env.ACCESS_TOKEN_SECRET)
  //   .then(async (decoded: IDecodeToken) => {
  //     try {
  //       if (decoded.status === AccountStatus.INACTIVE || !decoded.status) {
  //         throw new HttpError(ErrorCode.Member_Blocked);
  //       }

  //       req[decoded.type] = decoded.id;
  //       req['permissions'] = decoded.permissions;
  //       next();
  //     } catch (error) {
  //       next(new HttpError(error));
  //     }
  //   })
  //   .catch(() => {
  //     next(new HttpError(ErrorCode.Token_Expired, 401));
  //   });
}

export function checkRefreshToken(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.body.refreshToken || '';
  if (!refreshToken) {
    logger.warn('Can not find the refresh token');
    throw new HttpError(ErrorCode.Refresh_Token_Not_Exist);
  }

  verifyAsync(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    .then(async (decoded: IDecodeToken) => {
      try {
        const account = await getUserById(decoded.id);
        if (!account) throw new HttpError(ErrorCode.Unknown_Error);
        if (account.status === AccountStatus.INACTIVE || !account.status)
          throw new HttpError(ErrorCode.User_Blocked);
        req[decoded.type] = decoded.id;
        next();
      } catch (error) {
        next(new HttpError(error));
      }
    })
    .catch(() => {
      next(new HttpError(ErrorCode.Refresh_Token_Expire, 401));
    });
}

export function checkPermission(permissions: ROLE[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const hasOwnPermission = permissions.some((permission) => req.permissions.includes(permission));
    if (!hasOwnPermission) {
      next(
        new HttpError(
          ErrorCode.Permission_Denied,
          403,
          'You do not have permission to access this resource.'
        )
      );
    }
    next();
  };
}