"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const router = express_1.default.Router();
// ✅ Only admin can get all users
router.get('/', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), user_controller_1.getAllUsers);
// ✅ All authenticated users can get their own user info
router.get('/:id', (0, checkAuth_1.checkAuth)(), user_controller_1.getSingleUser);
router.patch("/:id", (0, checkAuth_1.checkAuth)(), user_controller_1.updateUser);
exports.UserRoutes = router;
