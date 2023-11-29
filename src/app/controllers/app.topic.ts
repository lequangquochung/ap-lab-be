import { APP, Get } from '$helpers/decorator';
import * as service from '$services/topic';
import { NextFunction, Request, Response } from 'express';
import { assignPaging } from '$helpers/utils';

@APP('/topic')
export default class TopicController {
    @Get('/:id')
    async getById(req: Request) {
        return await service.getGyId(Number(req.params.id));
    }

    @Get('')
    async getList(req: Request, res: Response, next: NextFunction) {
        const params = assignPaging(req.query);
        return await service.getListTopic(params);
    }
}
