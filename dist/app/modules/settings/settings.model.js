"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemSettings = void 0;
const mongoose_1 = require("mongoose");
const systemSettingsSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
});
exports.SystemSettings = (0, mongoose_1.model)('SystemSettings', systemSettingsSchema);
