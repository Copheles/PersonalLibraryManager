import { NextFunction, Request, Response } from 'express';
import { loginSchema, registerSchema } from '~/features/auth/auth.schema';
import { joiValiadation } from '~/shared/decorators/joi-validation.decorator';
import { authService } from '~/shared/services/auth.service';
import HTTP_STATUS from 'http-status-codes';
import { clearTokensCookie, sendTokensCookie, setAccessTokenToCookie } from '~/shared/helpers/cookie';

class AuthController {
  public async loggedOut(req: Request, res: Response, next: NextFunction) {
    const userId = req.currentUser?._id;

    console.log('userId', userId)
    if (userId) {
      await authService.logout(userId);
    }

    clearTokensCookie(res);

    return res.status(HTTP_STATUS.OK).json({ message: 'Logged out successfully' });
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    const { accessToken } = await authService.refreshToken(refreshToken);

    setAccessTokenToCookie(res, accessToken);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Token refreshed successfully'
    });
  }

  @joiValiadation(registerSchema)
  public async registerUser(req: Request, res: Response, next: NextFunction) {
    const tokens = await authService.addUser(req.body);

    sendTokensCookie(res, tokens);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'User registered successfully'
    });
  }

  @joiValiadation(loginSchema)
  public async loginUser(req: Request, res: Response, next: NextFunction) {
    const tokens = await authService.login(req.body);

    sendTokensCookie(res, tokens);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'User login successfully'
    });
  }
}

export const authController: AuthController = new AuthController();
