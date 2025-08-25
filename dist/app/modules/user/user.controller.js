"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getSingleUser = exports.getAllUsers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("./user.model");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Apperror_1 = __importDefault(require("../../utils/Apperror"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const users = await user_model_1.User.find().select('-password');
    res.status(http_status_1.default.OK).json({ success: true, data: users });
});
exports.getSingleUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    // Only allow if the user is accessing their own info
    const loggedInUserId = req.user?._id;
    if (id !== loggedInUserId) {
        throw new Apperror_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to view this user');
    }
    const user = await user_model_1.User.findById(id).select('-password');
    if (!user) {
        throw new Apperror_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    res.status(http_status_1.default.OK).json({ success: true, data: user });
});
exports.updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const loggedInUserId = req.user?._id;
    const role = req.user?.role;
    // Only allow if user is updating themselves OR admin is updating anyone
    if (id !== loggedInUserId && role !== "admin") {
        throw new Apperror_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to update this user");
    }
    const { name, phoneNumber, password } = req.body;
    const updateData = {};
    if (name)
        updateData.name = name;
    if (phoneNumber)
        updateData.phoneNumber = phoneNumber;
    if (password) {
        const hashed = await bcrypt_1.default.hash(password, 10);
        updateData.password = hashed;
    }
    const updatedUser = await user_model_1.User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!updatedUser) {
        throw new Apperror_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
    });
});
