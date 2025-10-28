import { Response } from 'express';
import { config } from '~/config';
import { UtilConstant } from '~/shared/constants/utils';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const isProduction = config.NODE_ENV === 'production';

export function sendTokensCookie(res: Response, tokens: Tokens): void {
  res.cookie('accessToken', tokens.accessToken, {
    maxAge: UtilConstant.DEFAULT_ACCESS_TOKEN_EXPIRES,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict'
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    maxAge: UtilConstant.DEFAULT_REFRESH_TOKEN_EXPIRES,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/api/v1/auth/refresh'
  });
}

export function setAccessTokenToCookie(res: Response, accessToken: string) {
  res.cookie('accessToken', accessToken, {
    maxAge: UtilConstant.DEFAULT_ACCESS_TOKEN_EXPIRES,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict'
  });
}

export function clearTokensCookie(res: Response): void {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
}
