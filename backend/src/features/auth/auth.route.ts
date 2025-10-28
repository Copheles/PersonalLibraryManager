import { Router } from 'express';
import { authController } from '~/features/auth/auth.controller';
import { loginLimiter, registerLimiter } from '~/features/auth/auth.rateLimit';
import { verifyUser } from '~/shared/middlewares/auth.middleware';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post('/auth/register', registerLimiter, authController.registerUser);
    this.router.post('/auth/login', loginLimiter, authController.loginUser);
    this.router.get('/auth/logout', verifyUser, authController.loggedOut);
    this.router.post('/auth/refresh', authController.refreshToken);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
