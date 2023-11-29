import { getRepository } from 'typeorm';
import log from '$helpers/log';
import { PagingParams } from '$interfaces/common';
import LogAction from '$entities/LogAction';
import { returnPaging } from '$helpers/utils';

const logger = log('Schedule');

interface SaveLog {
  targetId: string;
  description: string;
  actionData: string;
  requestURL: string;
  requestParams: string;
  createdBy: number;
  createdType: number;
  userId?: number;
}

interface SaveLogDragDrop {
  requestURL?: string;
  oldData?: string;
  newData?: string;
  createdBy?: number;
}

export async function saveLog(params: SaveLog) {
  const logActionRepo = getRepository(LogAction);
  await logActionRepo.save(params);
}

interface GetLog extends PagingParams {
  targetId?: string;
  memberId?: string;
  targetType?: number;
  logType?: number;
  createdType?: number;
  startTime?: string;
  endTime?: string;
  requestParams?: string;
}

export async function getLog(params: GetLog) {
  const logActionRepo = getRepository(LogAction);
  const builder = logActionRepo.createQueryBuilder('l').where('1=1');
  if (params.targetId) builder.andWhere('l.targetId = :targetId', { targetId: params.targetId });
  if (params.memberId) builder.andWhere('l.memberId = :memberId', { memberId: params.memberId });
  if (params.targetType)
    builder.andWhere('l.targetType = :targetType', { targetType: params.targetType });
  if (params.logType) builder.andWhere('l.logType = :logType', { logType: params.logType });
  if (params.createdType)
    builder.andWhere('l.createdType = :createdType', { createdType: params.createdType });
  if (params.createdType)
    builder.andWhere('l.createdType = :createdType', { createdType: params.createdType });
  if (params.startTime)
    builder.andWhere('l.createdDate >= :startTime', { startTime: params.startTime });
  if (params.requestParams)
    builder.andWhere('l.requestParams LIKE :requestParams', {
      requestParams: `%${params.requestParams}%`,
    });

  const [data, total] = await builder
    .offset(params.skip)
    .limit(params.take)
    .orderBy('l.createdDate', 'DESC')
    .getManyAndCount();

  return returnPaging(data, total, params);
}
