"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../utils/jwt");
const Apperror_1 = __importDefault(require("../../utils/Apperror"));
const wallet_model_1 = require("../wallet/wallet.model");
exports.AuthService = {
    // ✅ Correct method syntax
    registerUser: async (payload) => {
        const { email } = payload;
        // Check if email already exists
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            throw new Apperror_1.default(http_status_1.default.CONFLICT, 'User with this email already exists');
        }
        // Create user
        const user = await user_model_1.User.create(payload);
        // Create wallet
        await wallet_model_1.Wallet.create({
            user: user._id,
            balance: 50,
        });
        // Generate token
        const token = (0, jwt_1.createToken)({ userId: user._id, role: user.role });
        return {
            user,
            token,
        };
    },
    loginUser: async (payload) => {
        const { phoneNumber, password } = payload;
        const user = await user_model_1.User.findOne({ phoneNumber });
        if (!user) {
            throw new Apperror_1.default(401, 'User not found');
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Apperror_1.default(401, 'Incorrect password');
        }
        const token = (0, jwt_1.createToken)({ userId: user._id, role: user.role });
        return { accessToken: token };
    },
};
