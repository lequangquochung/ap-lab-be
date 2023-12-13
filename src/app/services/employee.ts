import { getRepository, EntityManager, getConnection, Repository } from 'typeorm';
import Employee from '$entities/Employee';
import { ErrorCode } from '$enums/index';
import { PagingParams } from '$interfaces/common';
import { returnPaging } from '$helpers/utils';

export interface ICreateEmployee {
    fullName: string,
    description: string,
    avatar: string,
    degree: string
  } 

export async function createEmployee(req: ICreateEmployee) {
    const emp = await getRepository(Employee).save({
      fullName: req.fullName,
      description: req.description,
      avatar: req.avatar,
      degree: req.degree
    });
    return { id: emp.id };
}

export async function getGyId(id : number) {
  const emp = await getRepository(Employee).findOne({ id: id});
  if (!emp) throw ErrorCode.Employee_Not_Exist;
  return {
    id: id,
    fullName: emp.fullName,
    avatar: emp.avatar,
    description: emp.description,
    degree: emp.degree
  }
}

export async function getListEmployee(params: PagingParams) {
  const employeeRepo = getRepository(Employee);

  const data = await employeeRepo.find({
    skip: params.skip,
    take: params.take,
    order: { id: 'DESC' },
  });
  const total = await employeeRepo.count();
  return returnPaging(data, total, params);
}

export async function updateEmployee(id: number, req: ICreateEmployee) {
  const employeeRepo = getRepository(Employee);

  const employee = await employeeRepo.findOne( {id: id} );
  if (!employee) throw ErrorCode.Employee_Not_Exist;

  await employeeRepo.update({
    id: id
  }, {
    fullName: req.fullName,
    degree: req.degree,
    description: req.description,
    avatar: req.avatar
  });
  return {
    id,
    fullName: req.fullName,
    degree: req.degree,
    description: req.description,
    avatar: req.avatar
  }
}

export async function deleteEmployee(id: number) {
  const employeeRepo = getRepository(Employee);

  const employee = await employeeRepo.findOne( {id: id} );
  if (!employee) throw ErrorCode.Employee_Not_Exist;

  await employeeRepo.delete({
    id: id
  });

  return {id: id};
}
