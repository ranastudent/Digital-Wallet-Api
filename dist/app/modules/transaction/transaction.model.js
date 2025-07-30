"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Wallet', default: null },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Wallet', default: null },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: ['add-money', 'withdraw', 'send', 'cash-in', 'cash-out'],
        required: true,
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success',
    },
    agent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null }, // NEW
    commission: { type: Number, default: 0 }, // NEW
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
