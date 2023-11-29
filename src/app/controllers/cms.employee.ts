import { CMS, Delete, Get, Post, Put, RequirePermission } from '$helpers/decorator';
import { validate } from '$helpers/ajv';
import * as service from '$services/employee';
import { createEmployeeSchema } from '$validators/cms.employee';
import { NextFunction, Request, Response } from 'express';
import { assignPaging } from '$helpers/utils';

@CMS('/employee')
export default class EmployeeController {

    @Post('')
    async createEmployee(req: any) {
        validate(createEmployeeSchema, req.body);
        return await service.createEmployee(req.body);
    }

    @Get('/:id')
    async getById(req: Request) {
        return await service.getGyId(Number(req.params.id));
    }

    @Get('')
    async getList(req: Request, res: Response, next: NextFunction) {
        const params = assignPaging(req.query);
        return await service.getListEmployee(params);
    }

    @Put('/:id')
    async updateById(req: Request, res: Response, next: NextFunction) {
        validate(createEmployeeSchema, req.body);
        return await service.updateEmployee(Number(req.params.id), req.body);
    }

    @Delete('/:id')
    async deleteById(req: Request, res: Response, next: NextFunction) {
        return await service.deleteEmployee(Number(req.params.id));
    }
}
