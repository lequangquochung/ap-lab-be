// import { APP, Get, Post, Put, RequirePermission } from '$helpers/decorator';
// import { Permissions } from '$enums';
// import { checkRefreshToken } from '$middlewares/common';
// import { validate } from '$helpers/ajv';
// import {
//   loginSchema,
//   changePasswordSchema,
//   requestVerifiedCodeSchema,
//   registerSchema,
//   resetPasswordSchema,
//   checkVerifiedCodeSchema,
//   checkEmailSchema,
//   changeDefaultPasswordSchema,
// } from '$validators/app.auth';
// import * as service from '$services/app.auth';
// import { Request } from 'express';

// @APP('/auth')
// export default class AuthController {
//   @Post('/login', [])
//   async login(req: Request) {
//     const body = req.body;
//     validate(loginSchema, body);
//     return await service.login(body);
//   }

//   @Post('/refresh-token', [checkRefreshToken])
//   async requestToken(req: Request) {
//     const memberId = req.memberId;
//     const { refreshToken } = req.body;  

//     const token = await service.createRefreshToken(memberId, refreshToken);
//     return { refreshToken: token.refreshToken, token: token.token };
//   }

//   @Post('/request-access-token', [checkRefreshToken])
//   async requestAccessToken(req: Request) {
//     const memberId = req.memberId;
//     const accessToken = await service.createAccessToken(memberId);
//     return { accessToken };
//   }

//   @Put('/change-password')
//   async changePassword(req: Request) {
//     const { memberId, body } = req;
//     validate(changePasswordSchema, body);
//     await service.changePassword(memberId, body);
//     return;
//   }

//   @Put('/change-default-password')
//   async changeDefaultPassword(req: Request) {
//     const { memberId, body } = req;
//     validate(changeDefaultPasswordSchema, body);
//     await service.changeDefaultPassword(memberId, body);
//   }

//   @Post('/request-verified-code', [])
//   async requestVerifiedCode(req: Request) {
//     const { body } = req;
//     validate(requestVerifiedCodeSchema, body);
//     return await service.createVerifiedCode(body);
//   }

//   @Post('/check-email', [])
//   async checkEmail(req: Request) {
//     const { body } = req;
//     validate(checkEmailSchema, body);
//     return await service.checkEmailExisted(body);
//   }

//   @Post('/check-verified-code', [])
//   async checkVerifiedCode(req: Request) {
//     const { body } = req;
//     validate(checkVerifiedCodeSchema, body);
//     return await service.checkVerifiedCode(body);
//   }

//   @Post('/register', [])
//   async register(req: Request) {
//     const { body } = req;
//     validate(registerSchema, body);
//     return await service.register(body);
//   }

//   @Post('/reset-password', [])
//   async resetPassword(req: Request) {
//     const { body } = req;
//     validate(resetPasswordSchema, body);
//     await service.resetPassword(body);
//     return;
//   }
// }
