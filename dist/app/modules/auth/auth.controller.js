"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
exports.AuthController = {
    register: (0, catchAsync_1.default)(async (req, res, next) => {
        const result = await auth_service_1.AuthService.registerUser(req.body);
        res.status(http_status_1.default.CREATED).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    }),
    login: (0, catchAsync_1.default)(async (req, res, next) => {
        const result = await auth_service_1.AuthService.loginUser(req.body);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    }),
};
