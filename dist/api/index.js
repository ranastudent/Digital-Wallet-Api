"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app")); // your Express app
const serverless_http_1 = __importDefault(require("serverless-http"));
exports.default = (0, serverless_http_1.default)(app_1.default);
