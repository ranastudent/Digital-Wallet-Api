"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const user_model_1 = require("./app/modules/user/user.model");
const Apperror_1 = __importDefault(require("./app/utils/Apperror"));
// import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Application routes
app.use('/api', routes_1.router);
// Global error handler
// app.use(globalErrorHandler);
// Not Found Route
app.get('/', (req, res) => {
    res.send('Server is up and connected to MongoDB');
});
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API Not Found' });
});
app.use(globalErrorHandler_1.globalErrorHandler);
if (!user_model_1.User) {
    throw new Apperror_1.default(404, 'User not found');
}
exports.default = app;
