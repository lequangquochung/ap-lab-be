import User from "$entities/User";
import { getRepository } from "typeorm";

export async function getUserById(userId: number) {
    const repoUser = getRepository(User);
    const user = await repoUser.findOne({id: userId});
    return user;
  }