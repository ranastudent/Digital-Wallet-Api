"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
    isAgentApproved: { type: Boolean, default: false },
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const hashed = await bcrypt_1.default.hash(this.password, 10);
    this.password = hashed;
    next();
});
exports.User = (0, mongoose_1.model)('User', userSchema);
