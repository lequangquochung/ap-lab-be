import { SimpleConsoleLogger, getRepository } from 'typeorm';
import { CommonStatus, ErrorCode } from '$enums/index';
import { PagingParams } from '$interfaces/common';
import { returnPaging } from '$helpers/utils';
import LabImage from '$entities/LabImage';

export interface ICreateLabImage {
    image: string,
    order: number
  } 

export async function addImage(req: ICreateLabImage) {
  const labImagheRepo = getRepository(LabImage);
  const images = await labImagheRepo.find();
  if (images && images.length > 0) {
    images.forEach((e, index) => {
      e.order = index + 1;
    });
    await labImagheRepo.save(images);
  }
  const image = await labImagheRepo.save({
      image: req.image,
      order: 0
  });
  return { id: image.id };
}

export async function setDashboardBg(req: ICreateLabImage) {
  const labImageRepo = getRepository(LabImage);
  const bg = await labImageRepo.findOne({ isDashboardBg: 1 });
  if (bg) {
    await labImageRepo.update({id: bg.id}, {image: req.image})
  } else {
    await labImageRepo.save({
      image: req.image,
      isDashboardBg: 1,
      order: 0,
    })
  }
  return { image: req.image };
}

export async function getDashboardBg() {
  console.log("teststststststw");
  const bg = await getRepository(LabImage)
    .createQueryBuilder('bg')
    .where('bg.isDashboardBg = :isDashboardBg', { isDashboardBg: CommonStatus.ACTIVE })
    .getOne();
  if (!bg) {
    throw ErrorCode.Lab_Image_Not_Exist;
  }
  return {
    image: bg.image
  }
}

export async function getGyId(id : number) {
  const image = await getRepository(LabImage).findOne({ id: id});
  if (!image) throw ErrorCode.Lab_Image_Not_Exist;
  return {
    id: image.id,
    image: image,
    order: image.order
  }
}

export async function getListLabImage(params: PagingParams) {
  const labImageRepo = getRepository(LabImage);

  const query = labImageRepo
    .createQueryBuilder('labImage')
    .select(['labImage.id', 'labImage.image', 'labImage.order'])
    .where('labImage.isDashboardBg = :isDashboardBg', { isDashboardBg: CommonStatus.INACTIVE })
    .orderBy('labImage.order', 'ASC');

  const total = await query.getCount();
  const data = await query
    .skip(params.skip)
    .take(params.take)
    .getMany();

  return returnPaging(data, total, params);
}

export async function updateLabImage(id: number, req: ICreateLabImage) {
  const labImageRepo = getRepository(LabImage);

  const labImage = await labImageRepo.findOne({ id: id });
  if (!labImage) throw ErrorCode.Lab_Image_Not_Exist;

  await labImageRepo.update({
    id: id
  }, {
    image: req.image,
    order: !req.order ? 0 : req.order,
  });
  return {
    id: id,
    image: req.image,
    order: !req.order ? 0 : req.order
  }
}

export async function deleteLabImage(id: number) {
  const labImageRepo = getRepository(LabImage);

  const labImage = await labImageRepo.findOne( {id: id} );
  if (!labImage) throw ErrorCode.Lab_Image_Not_Exist;
  
  await labImageRepo.delete({
    id: id
  });
  return {id: id};
}
