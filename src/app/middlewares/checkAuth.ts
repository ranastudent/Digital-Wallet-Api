import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { envVars } from '../config/env';

export const checkAuth = (requiredRoles?: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new Error('Token missing');
      }

      const decoded = jwt.verify(token, envVars.jwt.secret) as JwtPayload;

      if (!decoded || !decoded.userId || !decoded.role) {
        throw new Error('Invalid token payload');
      }

      // Normalize to array
      const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      // Check role if rolesArray has any roles specified
      if (requiredRoles && !rolesArray.includes(decoded.role)) {
        throw new Error('Unauthorized: insufficient permissions');
      }

      req.user = {
        _id: decoded.userId,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp
      };

      next();
    } catch (err) {
      next(err);
    }
  };
};
