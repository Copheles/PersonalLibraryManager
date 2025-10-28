import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '~/config';
import { ForbiddenError, NotAuthorized } from '~/shared/helpers/error-handler';

export function verifyUser(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies.accessToken) {
    throw new NotAuthorized('Token is invalid, please login again!');
  }


  const token = req.cookies.accessToken;
  try {
    const userDecoded = jwt.verify(token, config.JWT_TOKEN!) as UserPayload;

    req.currentUser = userDecoded;
    next();
  } catch (error) {
    throw new NotAuthorized('Token is invalid, please login again!');
  }
}

export function checkUserAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser) {
    throw new ForbiddenError('You are not logged in');
  }

  next();
}
