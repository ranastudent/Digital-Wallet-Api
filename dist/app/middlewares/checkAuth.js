"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const checkAuth = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new Error('Token missing');
            }
            const decoded = jsonwebtoken_1.default.verify(token, env_1.envVars.jwt.secret);
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
        }
        catch (err) {
            next(err);
        }
    };
};
exports.checkAuth = checkAuth;
