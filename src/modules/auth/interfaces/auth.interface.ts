export interface IAuthLogin {
  userLoginId: string;
  userEmail: string;
  userRole?: string | undefined;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface IRefreshTokenPayload {
  userId: string;
  tokenId: string;
  iat?: number;
  exp?: number;
}
