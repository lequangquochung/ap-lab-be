import { getRepository, EntityManager, getConnection, Repository } from 'typeorm';
import Employee from '$entities/Employee';
import { ErrorCode } from '$enums/index';
import { PagingParams } from '$interfaces/common';
import { returnPaging } from '$helpers/utils';
import Topic from '$entities/Topic';
import { deleteFileByName } from '$middlewares/common';

export interface ICreateTopic {
    title: string,
    content: string,
    subContent: string,
    thumbnail: string
  } 

export async function createTopic(req: ICreateTopic) {
  const topic = await getRepository(Topic).save({
    title: req.title,
    content: req.content,
    subContent: req.subContent,
    thumbnail: req.thumbnail
  });
  return { id: topic.id };
}

export async function getGyId(id : number) {
  const topic = await getRepository(Topic).findOne({ id: id});
  if (!topic) throw ErrorCode.Topic_Not_Exist;
  return {
    id: topic.id,
    title: topic.title,
    thumbnail: topic.thumbnail,
    content: topic.content,
    subContent: topic.subContent
  }
}

export async function getListTopic(params: PagingParams) {
  const topicRepo = getRepository(Topic);

  const query = topicRepo
    .createQueryBuilder('topic')
    .select(['topic.id', 'topic.subContent', 'topic.thumbnail', 'topic.createdDate', 'topic.title'])
    .orderBy('topic.createdDate', 'DESC');

  const total = await query.getCount();
  const data = await query
    .skip(params.skip)
    .take(params.take)
    .getMany();

  return returnPaging(data, total, params);
}

export async function updateTopic(id: number, req: ICreateTopic) {
  const topicRepo = getRepository(Topic);

  const topic = await topicRepo.findOne( {id: id} );
  if (!topic) throw ErrorCode.Topic_Not_Exist;

  await topicRepo.update({
    id: id
  }, {
    title: req.title,
    thumbnail: req.thumbnail,
    content: req.content,
    subContent: req.subContent
  });
  return {
    id: id,
    title: req.title,
    thumbnail: req.thumbnail,
    content: req.content,
    subContent: req.subContent
  }
}

export async function deleteTopic(id: number) {
  const topicRepo = getRepository(Topic);

  const topic = await topicRepo.findOne( {id: id} );
  if (!topic) throw ErrorCode.Topic_Not_Exist;
  await topicRepo.delete({
    id: id
  });
  return {id: id};
}
