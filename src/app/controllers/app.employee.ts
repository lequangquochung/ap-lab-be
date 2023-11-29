import { APP, Get } from '$helpers/decorator';
import * as service from '$services/employee';
import { NextFunction, Request, Response } from 'express';
import { assignPaging } from '$helpers/utils';

@APP('/employee')
export default class EmployeeController {
    @Get('/:id')
    async getById(req: Request) {
        return await service.getGyId(Number(req.params.id));
    }

    @Get('')
    async getList(req: Request, res: Response, next: NextFunction) {
        const params = assignPaging(req.query);
        return await service.getListEmployee(params);
    }
}
