import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { envVars } from '../config/env';

export const createToken = (payload: object): string => {
  const secret = envVars.jwt.secret as string;

  const options: SignOptions = {
    expiresIn: envVars.jwt.expiresIn as SignOptions['expiresIn'], // ✅ use as string
  };

  console.log('🚀 JWT expiresIn:', options.expiresIn); // Should show: 1h or 7d
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, envVars.jwt.secret as string);
};
