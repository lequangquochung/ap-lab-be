import { CMS, Delete, Get, Post, Put, RequirePermission } from '$helpers/decorator';
import { validate } from '$helpers/ajv';
import * as service from '$services/topic';
import { NextFunction, Request, Response } from 'express';
import { assignPaging } from '$helpers/utils';
import { createTopicSchema } from '$validators/cms.topic';

@CMS('/topic')
export default class TopicController {

    @Post('')
    async createTopic(req: any) {
        validate(createTopicSchema, req.body);
        return await service.createTopic(req.body);
    }

    @Get('/:id')
    async getById(req: Request) {
        return await service.getGyId(Number(req.params.id));
    }

    @Get('')
    async getList(req: Request, res: Response, next: NextFunction) {
        const params = assignPaging(req.query);
        return service.getListTopic(params);
    }

    @Put('/:id')
    async updateById(req: Request, res: Response, next: NextFunction) {
        validate(createTopicSchema, req.body);
        return service.updateTopic(Number(req.params.id), req.body);
    }

    @Delete('/:id')
    async deleteById(req: Request, res: Response, next: NextFunction) {
        return service.deleteTopic(Number(req.params.id));
    }
}
