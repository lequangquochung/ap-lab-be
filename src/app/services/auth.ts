import { getRepository, EntityManager, getConnection, Repository } from 'typeorm';
import { LoginParams, Token, ChangePasswordParams, IUpdateUser } from '$interfaces/auth.interface';
import { compare, hash } from 'bcryptjs';
import User from '$entities/User';
import { sign, verify } from 'jsonwebtoken';
import { pick } from 'lodash';
import { promisify } from 'util';
import to from 'await-to-js';
import config from '$config';
import { ErrorCode, UserStatus } from '$enums/index';
const verifyAsync = promisify(verify) as any;

export async function login(params: LoginParams): Promise<any> {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const userRepository = getRepository(User);
    const { email, password } = params;

    const user = await userRepository.findOne({ email }, { select: ['id', 'password'] });
    if (!user) throw ErrorCode.Username_Or_Password_Invalid;
    if (user.status === UserStatus.INACTIVE) throw ErrorCode.User_Blocked;

    const isTruePassword = await compare(password, user.password);
    if (!isTruePassword) throw ErrorCode.Username_Or_Password_Invalid;

    const  token = await generateTokenCms(user.id);
    return {
      accessToken: token.token,
      refreshToken: token.refreshToken
    }
  });
}

export async function changePassword(userId: number, params: ChangePasswordParams) {
  const repoUser = getRepository(User);
  const { oldPassword, newPassword } = params;
  if (oldPassword === newPassword) throw ErrorCode.Invalid_Input;

  const user = await repoUser.findOne(userId, { select: ['password'] });
  if (!user) throw ErrorCode.User_Not_Exist;

  const isTruePassword = await compare(oldPassword, user.password);
  if (!isTruePassword) throw ErrorCode.Username_Or_Password_Invalid;

  const passwordHash = await hash(newPassword, Number(process.env.SALT_ROUNDS));
  await repoUser.update(userId, { password: passwordHash });
  return;
}

/**
 * Create token & refresh token for user CMS
 * Get list permissions & assign it into the token
 * if refresh the token expired => create new refresh token
 */
export async function generateTokenCms(userId: number): Promise<Token> {
  const userRepository = getRepository(User);
  const user = await getUserInformation(userRepository, userId);

  const dataEncode = pick(user, ['id', 'status', 'email', 'phoneNumber', 'role']);
  dataEncode['type'] = 'userId';
  const token = generateAccessToken(dataEncode);
  const oldRefreshToken = user.refreshToken;
  const [error] = await to(verifyAsync(oldRefreshToken, config.auth.AccessTokenExpire));

  if (error) {
    const dataEncodeRefreshToken = pick(user, ['id', 'status', 'email', 'phoneNumber']);
    dataEncodeRefreshToken['type'] = 'userId';
    const newRefreshToken = generateRefreshToken(dataEncodeRefreshToken);
    await userRepository.update(userId, { refreshToken: newRefreshToken });
    return { token, refreshToken: newRefreshToken };
  }

  return { token, refreshToken: oldRefreshToken };
}

export async function createAccessToken(userId: number): Promise<string> {
  const userRepository = getRepository(User);
  const user = await getUserInformation(userRepository, userId);
  const dataEncode = pick(user, ['id', 'status', 'email', 'phoneNumber', 'permissions']);
  dataEncode['type'] = 'userId';
  return generateAccessToken(dataEncode);
}

const generateAccessToken = (dataEncode) => {
  return sign(dataEncode, config.auth.AccessTokenSecret, {
    algorithm: 'HS256',
    expiresIn: Number(config.auth.AccessTokenExpire),
  });
};

const generateRefreshToken = (dataEncode) => {
  return sign(dataEncode, config.auth.RefreshTokenSecret, {
    algorithm: 'HS256',
    expiresIn: Number(config.auth.RefreshTokenExpire),
  });
};

/**
 * Get common info & list permissions of the admin
 */
export async function getUserInformation(
  userRepository: Repository<User>,
  userId: number
): Promise<User> {
  const user = await userRepository
    .createQueryBuilder('user')
    .select(['user.id', 'user.status', 'user.email', 'user.phoneNumber', 'user.refreshToken', 'user.role'])
    .where('user.id = :userId', { userId: userId })
    .getOne();
  if (!user) throw ErrorCode.User_Not_Exist;
  user['permissions'] = user['role'];
  return user;
}

export async function getAdminInformation(userId: number): Promise<User> {
  const userRepository = getRepository(User);
  const user = userRepository.findOne(userId, {
    select: ['id', 'status', 'email', 'phoneNumber', 'fullName', 'refreshToken'],
  });
  return user;
}

export async function updateProfileAdmin(id: number, params: IUpdateUser) {
  const userRepo = getRepository(User);
  const user = await userRepo.findOne(id);
  if (!user) throw ErrorCode.Not_Found;
  await userRepo.update(id, params);
  return;
}
