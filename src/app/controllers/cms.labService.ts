import { CMS, Delete, Get, Post, Put } from '$helpers/decorator';
import { validate } from '$helpers/ajv';
import * as service from '$services/labService';
import { NextFunction, Request, Response } from 'express';
import { labServiceSchema } from '$validators/cms.labService';

@CMS('/lab-service')
export default class LabServiceController {

    @Post('')
    async createLabService(req: any) {
        validate(labServiceSchema, req.body);
        return await service.createLabService(req.body);
    }

    @Get('/:id')
    async getById(req: Request) {
        return await service.getGyId(Number(req.params.id));
    }

    @Get('')
    async getList(req: Request, res: Response, next: NextFunction) {
        return service.getListLabService();
    }

    @Put('/:id')
    async updateById(req: Request, res: Response, next: NextFunction) {
        validate(labServiceSchema, req.body);
        return service.updateLabService(Number(req.params.id), req.body);
    }

    @Delete('/:id')
    async deleteById(req: Request, res: Response, next: NextFunction) {
        return service.deleteLabService(Number(req.params.id));
    }
}
