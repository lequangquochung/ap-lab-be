import { EntityManager, getConnection, getRepository } from 'typeorm';
import { ErrorCode } from '$enums/index';
import LabService from '$entities/LabService';
import LabServiceDetail from '$entities/LabServiceDetail';

export interface ICreateLabService {
    title: string,
    order: number,
    details: IcreateLabServiceDetail[]
}

export interface IcreateLabServiceDetail {
    id: number,
    content: string,
    order: number
}

export async function createLabService(req: ICreateLabService) {
    return await getConnection().transaction(async (transaction: EntityManager) => {
        const labServiceRepo = transaction.getRepository(LabService);
        const labServiceDetailRepo = transaction.getRepository(LabServiceDetail);
        const labService = await labServiceRepo.save({  
            title: req.title,
            order: req.order
        });

        if (req.details && req.details.length > 0) {
            let labServiceDetails = [];
            req.details.forEach((detail: IcreateLabServiceDetail) => {
                labServiceDetails.push({
                    content: detail.content,
                    order: detail.order,
                    labService: labService,
                });
            })
            await labServiceDetailRepo.save(labServiceDetails);
        }
        return { id: labService.id };
    });
}

export async function getGyId(id : number) {
    const labServiceRepo = getRepository(LabService);

    const labService = await labServiceRepo
        .createQueryBuilder('ls')
        .leftJoinAndSelect('ls.details', 'detail')
        .where('ls.id = :id', { id })
        .orderBy('detail.order', 'ASC')
        .getOne();

    if (!labService) throw ErrorCode.Lab_Service_Not_Exist;
    return labService;
}

export async function getLabServiceAndDetail() {
    const labServiceRepo = getRepository(LabService);

    const labService = await labServiceRepo
        .createQueryBuilder('ls')
        .leftJoinAndSelect('ls.details', 'detail')
        .select(['ls.title', 'detail.content'])
        .orderBy('detail.order', 'ASC')
        .orderBy('ls.order', 'ASC')
        .getMany();

    if (!labService) throw ErrorCode.Lab_Service_Not_Exist;
    return labService;
}

export async function getListLabService() {
    const labImageRepo = getRepository(LabService);

    const data = await labImageRepo
    .createQueryBuilder('ls')
    .select(['ls.id', 'ls.title', 'ls.order'])
    .orderBy('ls.order', 'ASC')
    .getMany();

    return data;
}

export async function getListLabServiceApp() {
    const labImageRepo = getRepository(LabService);

    const data = await labImageRepo
    .createQueryBuilder('ls')
    .select(['ls.id', 'ls.title', 'ls.order'])
    .orderBy('ls.order', 'ASC')
    .getMany();

    data.forEach((d) => {
        d.title = d.title.replace(/ - /g, ' ');
    });
    return data;
}

export async function updateLabService(id: number, req: ICreateLabService) {
    return await getConnection().transaction(async (transaction: EntityManager) => {
        const labServiceRepo = transaction.getRepository(LabService);
        const labServiceDetailRepo = transaction.getRepository(LabServiceDetail);

        const labService = await labServiceRepo.findOne({ id: id });
        if (!labService) throw ErrorCode.Lab_Service_Not_Exist;    
        
        await labServiceRepo.update({
            id: id
            }, {
            title: req.title,
            order: !req.order ? 0 : req.order
        });
    
        await labServiceDetailRepo.delete({ labService: labService });
        if (req.details && req.details.length > 0) {
            let labServiceDetails = [];
            req.details.forEach((detail: IcreateLabServiceDetail) => {
                labServiceDetails.push({
                    id: detail.id,
                    content: detail.content,
                    order: detail.order,
                    labService: labService,
                });
            })
            await labServiceDetailRepo.save(labServiceDetails);
        }
        return {
            id
            };
    });
}

export async function deleteLabService(id: number) {
    return await getConnection().transaction(async (transaction: EntityManager) => {
        const labServiceRepo = transaction.getRepository(LabService);
        const labServiceDetailRepo = transaction.getRepository(LabServiceDetail);

        const labService = await labServiceRepo.findOne(id, { relations: ['details']} );
        if (!labService) {
            throw ErrorCode.Lab_Service_Not_Exist;
        } else {
            if (labService.details && labService.details.length > 0) {
                await labServiceDetailRepo.remove(labService.details);
            }
        }

        await labServiceRepo.remove(labService);
        return { id };
    });
}