import { APP, Get } from '$helpers/decorator';
import * as service from '$services/labImage';
import { NextFunction, Request, Response } from 'express';
import { assignPaging } from '$helpers/utils';

@APP('/lab-image')
export default class LabImageController {
    @Get('')
    async getList(req: Request, res: Response, next: NextFunction) {
        const params = assignPaging(req.query);
        return await service.getListLabImage(params);
    }

    @Get('/dashboard/background')
    async getDashboardBg() {
        return await service.getDashboardBg();
    }
}
