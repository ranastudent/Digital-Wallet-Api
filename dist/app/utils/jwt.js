"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const createToken = (payload) => {
    const secret = env_1.envVars.jwt.secret;
    const options = {
        expiresIn: env_1.envVars.jwt.expiresIn, // ✅ use as string
    };
    console.log('🚀 JWT expiresIn:', options.expiresIn); // Should show: 1h or 7d
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.createToken = createToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.envVars.jwt.secret);
};
exports.verifyToken = verifyToken;
