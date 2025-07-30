"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Define a higher-order function to wrap async route handlers
const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};
exports.default = catchAsync;
