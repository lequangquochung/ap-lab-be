import { APP, Get } from '$helpers/decorator';
import * as service from '$services/labService';
import { NextFunction, Request, Response } from 'express';

@APP('/lab-service')
export default class LabServiceController {
    @Get('')
    async getList(req: Request, res: Response, next: NextFunction) {
        return await service.getListLabService();
    }

    @Get('/detail')
    async getListAndDetail(req: Request, res: Response, next: NextFunction) {
        return await service.getLabServiceAndDetail();
    }
}
