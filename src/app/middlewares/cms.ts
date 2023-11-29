import { Request, Response, NextFunction } from 'express';
import { HttpError } from '$helpers/response';
import { ErrorCode, AccountStatus, ROLE } from '$enums/index';
import { promisify } from 'util';
import { verify } from 'jsonwebtoken';
import log from '$helpers/log';
const logger = log('Middle ware check token');
import config from '$config';
import { getAdminInformation } from '$services/auth';

const verifyAsync = promisify(verify) as any;
interface IDecodeToken {
  id: number;
  status: AccountStatus;
  type: 'userId';
  role: string[];
}

export function checkTokenCMS(req: Request, res: Response, next: NextFunction) {
  let token = req.headers['authorization'] || '';
  token = token.replace('Bearer ', '');
  if (!token) {
    throw new HttpError(ErrorCode.Token_Not_Exist);
  }

  verifyAsync(token, config.auth.AccessTokenSecret)
    .then(async (decoded: IDecodeToken) => {
      try {
        const user = await getAdminInformation(decoded.id);
        if (user.status === AccountStatus.INACTIVE || !user.status) {
          throw new HttpError(ErrorCode.Member_Blocked);
        }

        req[decoded.type] = decoded.id;
        req['permissions'] = decoded.role;
        next();
      } catch (error) {
        next(new HttpError(error));
      }
    })
    .catch(() => {
      next(new HttpError(ErrorCode.Token_Expired, 401));
    });
}

export function checkRefreshToken(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.body.refreshToken || '';
  if (!refreshToken) {
    logger.warn('Can not find the refresh token');
    throw new HttpError(ErrorCode.Refresh_Token_Not_Exist);
  }

  verifyAsync(refreshToken, config.auth.RefreshTokenSecret)
    .then(async (decoded: IDecodeToken) => {
      try {
        const user = await getAdminInformation(decoded.id);
        if (!user) throw new HttpError(ErrorCode.Unknown_Error);
        if (user.status === AccountStatus.INACTIVE || !user.status)
          throw new HttpError(ErrorCode.Member_Blocked);
        req.userId = decoded.id;
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
