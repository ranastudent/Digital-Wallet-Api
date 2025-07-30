"use strict";
// src/app/middlewares/globalErrorHandler.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Apperror_1 = __importDefault(require("../utils/Apperror"));
const globalErrorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';
    let errorDetails = {};
    // If it's an AppError
    if (err instanceof Apperror_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = {
            stack: err.stack,
        };
    }
    else if (err.name === 'ValidationError') {
        // Optional: for Mongoose validation errors
        statusCode = http_status_1.default.BAD_REQUEST;
        message = err.message;
    }
    else if (err.name === 'CastError') {
        // Optional: invalid MongoDB ObjectId
        statusCode = http_status_1.default.BAD_REQUEST;
        message = 'Invalid ID format';
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { errorDetails }),
    });
};
exports.globalErrorHandler = globalErrorHandler;
