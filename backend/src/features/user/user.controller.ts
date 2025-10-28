import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class UserController {
  public async getMe(req: Request, res: Response, next: NextFunction) {
    return res.status(HTTP_STATUS.OK).json(req.currentUser);
  }
}

export const userController: UserController = new UserController();
