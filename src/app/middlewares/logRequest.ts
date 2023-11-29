import config from '$config';
import log from '$helpers/log';
import { Request, Response, NextFunction } from 'express';
import { cloneDeep } from 'lodash';
import { verify } from 'jsonwebtoken';
const logger = log('Request');

const fullPathUrlConditions = [
  '/cms/members/add-plan',
  '/cms/members/add-course',
  '/cms/terms/confirm',
  '/bookings/normal',
  '/bookings/free',
];

const haftPathUrlConditions = [
  '/bookings/normal',
  '/bookings/free',
  '/booking/update-',
  '/booking/normal',
  '/booking/free',
  '/bookings/cancel',
];

export default function logRequest(req: Request, res: Response, next: NextFunction) {
  if (config.environment !== 'production') {
    const method = req.method;
    const fullPath = req.originalUrl;
    const body = req.body || [];
    logger.info(`Method: ${method} | FullPath: ${fullPath} | Body: ${JSON.stringify(body)}`);
    if (config.environment === 'staging') {
      if (
        fullPathUrlConditions.includes(fullPath) ||
        haftPathUrlConditions.some((condition) => fullPath.includes(condition)) ||
        method === 'DELETE'
      ) {
        let token = req?.headers?.authorization || '';
        let memberId;
        if (token) {
          token = token.replace('Bearer ', '');
          try {
            const response: any = verify(
              token,
              fullPath.includes('/cms')
                ? process.env.CMS_ACCESS_TOKEN_SECRET
                : process.env.ACCESS_TOKEN_SECRET
            );
            memberId = response?.id;
          } catch (error) {}
        }
      }
    }
  }
  if (config.environment === 'production') {
    const method = req.method;
    const fullPath = req.originalUrl || '';
    const userAgent = req.headers['user-agent'];
    const body = cloneDeep(req.body) || {};
    const ip = req.headers['x-forwarded-for'];
    delete body.password;
    let memberId: string | number | null;
    if (fullPath.includes('/cms') || method === 'DELETE') {
      let token = req?.headers?.authorization || '';
      if (token) {
        token = token.replace('Bearer ', '');
        try {
          const response: any = verify(
            token,
            fullPath.includes('/cms')
              ? process.env.CMS_ACCESS_TOKEN_SECRET
              : process.env.ACCESS_TOKEN_SECRET
          );
          memberId = response?.id;
        } catch (error) {}
      }
    }
    logger.info(
      `Method: ${method} | FullPath: ${fullPath} | IP: ${ip} | User-Agent: ${userAgent} | ${
        memberId ? `MemberId: ` + memberId + ` |` : ''
      } Body: ${JSON.stringify(body)}`
    );
  }
  next();
}
