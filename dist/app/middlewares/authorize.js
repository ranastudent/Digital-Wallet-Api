"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Apperror_1 = __importDefault(require("../utils/Apperror"));
const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        throw new Apperror_1.default(http_status_1.default.FORBIDDEN, 'Forbidden access');
    }
    next();
};
exports.authorize = authorize;
