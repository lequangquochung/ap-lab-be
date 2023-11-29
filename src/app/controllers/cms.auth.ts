import { CMS, Get, Post, Put, RequirePermission } from '$helpers/decorator';
import { checkRefreshToken } from '$middlewares/cms';
import {
  LoginRequest,
  ChangePasswordRequest,
  RequestTokenRequest,
} from '$interfaces/auth.interface';
import { validate } from '$helpers/ajv';
import {
  loginSchema,
  changePasswordSchema,
  updateSchema,
} from '$validators/cms.auth';
import * as service from '$services/auth';
import { Request } from 'express';
import { ROLE } from '$enums/index';

@CMS('/auth')
export default class AuthController {
  /**
   * URL: {{domain}}/v1/cms/auth/login
   * This API not require access token.
   */
  @Post('/login', [])
  async login(req: LoginRequest) {
    validate(loginSchema, req.body);
    return await service.login(req.body);
  }

  /**
   * URL: {{domain}}/v1/cms/auth/change-password
   * This API require access token.
   */
  @Put('/change-password')
  @RequirePermission([ROLE.ADMIN])
  async changePassword(req: ChangePasswordRequest) {
    const { userId, body } = req;
    validate(changePasswordSchema, body);
    await service.changePassword(userId, body);
    return;
  }

  /**
   * URL: {{domain}}/v1/cms/auth/request-access-token
   * This API require refresh token in the body.
   */
  @Post('/request-access-token', [checkRefreshToken])
  async requestAccessToken(req: RequestTokenRequest) {
    const userId = req.userId;
    const accessToken = await service.createAccessToken(userId);
    return { accessToken };
  }

  @Get('/profile')
  @RequirePermission([ROLE.ADMIN])
  async getAdminProfile(req: Request) {
    const userId = req.userId;
    return await service.getAdminInformation(userId);
  }

  @Put('/profile')
  @RequirePermission([ROLE.ADMIN])
  async updateProfileAdmin(req: Request) {
    const { userId, body } = req;
    validate(updateSchema, req.body);
    await service.updateProfileAdmin(userId, body);
    return;
  }
}
