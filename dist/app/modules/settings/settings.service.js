"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const settings_model_1 = require("./settings.model");
exports.SettingsService = {
    async set(key, value) {
        return await settings_model_1.SystemSettings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    },
    async get(key) {
        const setting = await settings_model_1.SystemSettings.findOne({ key });
        return setting?.value;
    },
    async getAll() {
        return await settings_model_1.SystemSettings.find();
    }
};
