import { CMS, Delete, Get, Post, Put } from '$helpers/decorator';
import { validate } from '$helpers/ajv';
import * as service from '$services/labImage';
import { NextFunction, Request, Response } from 'express';
import { assignPaging } from '$helpers/utils';
import { labImageSchema } from '$validators/cms.labImage';

@CMS('/lab-image')
export default class LabImageController {

    @Post('')
    async addLabImage(req: any) {
        validate(labImageSchema, req.body);
        return await service.addImage(req.body);
    }

    @Post('/dashboard/background')
    async setDashboardBg(req: any) {
        validate(labImageSchema, req.body);
        return await service.setDashboardBg(req.body);
    }

    @Get('/dashboard/background')
    async getDashboardBg() {
        return await service.getDashboardBg();
    }

    @Get('/:id')
    async getById(req: Request) {
        return await service.getGyId(Number(req.params.id));
    }

    @Get('')
    async getList(req: Request, res: Response, next: NextFunction) {
        const params = assignPaging(req.query);
        return service.getListLabImage(params);
    }

    @Put('/:id')
    async updateById(req: Request, res: Response, next: NextFunction) {
        validate(labImageSchema, req.body);
        return service.updateLabImage(Number(req.params.id), req.body);
    }

    @Delete('/:id')
    async deleteById(req: Request, res: Response, next: NextFunction) {
        return service.deleteLabImage(Number(req.params.id));
    }
}
