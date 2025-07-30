"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
if (!process.env.JWT_SECRET) {
    throw new Error('❌ JWT_SECRET is not defined in .env');
}
exports.envVars = {
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    jwt: {
        secret: process.env.JWT_SECRET, // now guaranteed to be string
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
};
