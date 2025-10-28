import { IAuthLogin, IAuthRegister } from '~/features/auth/auth.interface';
import UserModel, { UserDocument } from '~/features/user/user.model';
import { BadRequestError, NotAuthenticated, NotAuthorized } from '~/shared/helpers/error-handler';
import jwt from 'jsonwebtoken';
import { config } from '~/config';
import { UtilConstant } from '~/shared/constants/utils';

interface TokenPayload {
  _id: string;
  email: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  public async addUser(requestBody: IAuthRegister) {
    const { email, password } = requestBody;

    const emailExists = await authService.isEmailAlreadyExists(requestBody.email);
    if (emailExists) {
      throw new BadRequestError('Email is already in used');
    }

    const user = await UserModel.create({
      email,
      password
    });

    const payload = {
      _id: user._id as string,
      email: user.email
    };

    const tokens = this.generateTokens(payload);

    // Save refresh token to user
    await this.saveRefreshToken(user._id as string, tokens.refreshToken);

    return tokens;
  }

  public async login(requestBody: IAuthLogin): Promise<Tokens> {
    const { email, password } = requestBody;
    const user: UserDocument | null = await this.getUserByEmail(email);

    if (!user) throw new BadRequestError('Invalid credentials');

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) throw new BadRequestError('Invalid credentials');

    const payload: TokenPayload = {
      _id: user._id as string,
      email: user.email
    };

    const tokens = this.generateTokens(payload);

    // Save refresh token to user
    await this.saveRefreshToken(user._id as string, tokens.refreshToken);

    return tokens;
  }

  public async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new NotAuthenticated('Please Login again');
    }

    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_TOKEN!) as TokenPayload;

    const user = await UserModel.findById(decoded._id);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    // Verify the refresh token matches the one stored in user
    if (user.refreshToken !== refreshToken) {
      throw new BadRequestError('Invalid refresh token');
    }

    const payload: TokenPayload = {
      _id: user._id as string,
      email: user.email
    };

    // Generate ONLY new access token
    const accessToken = jwt.sign(payload, config.JWT_TOKEN!, {
      expiresIn: UtilConstant.DEFAULT_ACCESS_TOKEN_EXPIRES
    });

    return { accessToken };
  }
  public async logout(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $set: { refreshToken: null } });
  }

  public async isEmailAlreadyExists(email: string) {
    const userByEmail = await UserModel.findOne({
      email
    });

    return userByEmail != null;
  }

  private async getUserByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  private generateTokens(payload: TokenPayload): Tokens {
    const accessToken = jwt.sign(payload, config.JWT_TOKEN!, {
      expiresIn: UtilConstant.DEFAULT_ACCESS_TOKEN_EXPIRES
    });

    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_TOKEN!, {
      expiresIn: UtilConstant.DEFAULT_REFRESH_TOKEN_EXPIRES
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      refreshToken
    });
  }
}

export const authService: AuthService = new AuthService();
