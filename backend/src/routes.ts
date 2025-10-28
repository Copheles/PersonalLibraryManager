import { Application } from 'express';
import { authRoutes } from '~/features/auth/auth.route';
import { bookRoutes } from '~/features/book/book.route';
import { userRoutes } from '~/features/user/user.route';
import { verifyUser } from '~/shared/middlewares/auth.middleware';

const BASE_PATH = '/api/v1';

const appRoutes = (app: Application) => {
  app.use(BASE_PATH, authRoutes.routes());
  app.use(BASE_PATH, verifyUser, userRoutes.routes());
  app.use(BASE_PATH, verifyUser, bookRoutes.routes());
};

export default appRoutes;
