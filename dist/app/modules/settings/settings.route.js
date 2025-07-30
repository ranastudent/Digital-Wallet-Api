"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const settings_controller_1 = require("./settings.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.patch('/', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), settings_controller_1.updateSystemSetting); // body: { key, value }
router.get('/:key', settings_controller_1.getSystemSetting);
exports.SettingsRoutes = router;
