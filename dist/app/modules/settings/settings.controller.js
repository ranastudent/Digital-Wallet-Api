"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemSetting = exports.updateSystemSetting = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const settings_service_1 = require("./settings.service");
exports.updateSystemSetting = (0, catchAsync_1.default)(async (req, res) => {
    const { key, value } = req.body;
    const updated = await settings_service_1.SettingsService.set(key, value);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Setting updated',
        data: updated,
    });
});
exports.getSystemSetting = (0, catchAsync_1.default)(async (req, res) => {
    const { key } = req.params;
    const value = await settings_service_1.SettingsService.get(key);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Setting fetched',
        data: value,
    });
});
