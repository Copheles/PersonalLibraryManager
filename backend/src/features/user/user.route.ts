import { Router } from 'express';
import { userController } from '~/features/user/user.controller';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/users/me', userController.getMe);

    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
