const defaultTokenExpiresIn = '15m';
const defaultRefreshTokenExpiresIn = '30d';

export const jwtConstants = {
  tokenSecret: process.env.JWT_ACCESS_SECRET_KEY || 'secret',
  tokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || defaultTokenExpiresIn,
  refreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
  refreshExpiresIn:
    process.env.JWT_REFRESH_EXPIRES_IN || defaultRefreshTokenExpiresIn,
};
