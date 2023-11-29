import { HttpError, HttpErrorController } from '$helpers/response';
import { NextFunction, Request, Response } from 'express';
import log from '$helpers/log';
import { saveLog } from '$services/common';
import { CREATED_TYPE } from '$enums/index';

export const handleError = async (
  error: HttpError | HttpErrorController,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, errorCode, errorKey, devMessage } = error;
  if (errorKey) {
    loggingError(req, error);
  } else {
    log('CONTROLLER').error(error);
  }
  let errorMessage = errorKey;
  const responseData = {
    success: false,
    errorCode,
    errorKey,
    errorMessage,
    data: null,
    devMessage,
  };

  return res.status(statusCode).send(responseData);
};

function loggingError(req: Request, error) {
  const method = req.method;
  const fullPath = req.originalUrl;
  const body = req.body || [];
  const logger = error.logger ? error.logger : log('INFO');
  delete error.logger;

  logger.error(`${error.errorKey}${error.devMessage ? `\nReason: ${error.devMessage}` : ''}`);

  let requestParams = { ...body };
  const lastPathSub: string | number = fullPath.split('/')[fullPath.split('/').length - 1];
  if (!isNaN(Number(lastPathSub))) requestParams.requestedId = Number(lastPathSub);
  saveLog({
    targetId: undefined,
    description: `${error.errorKey}${
      error.devMessage ? `\nReason: ${JSON.stringify(error.devMessage)}` : ''
    }`,
    actionData: undefined,
    requestURL: req.originalUrl,
    requestParams: `${JSON.stringify(requestParams)}`,
    createdBy: req.userId,
    createdType: req.userId ? CREATED_TYPE.USER : CREATED_TYPE.ADMIN,
  });
  logger.error(`Method: ${method} | FullPath: ${fullPath} | Body: ${JSON.stringify(body)}\n`);
}
