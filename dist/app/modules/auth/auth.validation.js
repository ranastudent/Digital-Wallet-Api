"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(4, 'Name is required'),
        email: zod_1.z.string().email({ message: 'Invalid email address' }),
        phoneNumber: zod_1.z
            .string()
            .min(11, { message: 'Phone number must be at least 11 digits' })
            .max(15, { message: 'Phone number must be at most 15 digits' }),
        password: zod_1.z.string().min(6, { message: 'Password must be at least 6 characters' }),
        role: zod_1.z.enum(['user', 'admin', 'agent']).optional(),
    }),
});
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z
            .string()
            .min(11, { message: 'Phone number must be at least 11 digits' })
            .max(15, { message: 'Phone number must be at most 15 digits' }),
        password: zod_1.z.string().min(6, { message: 'Password is required' }),
    }),
});
