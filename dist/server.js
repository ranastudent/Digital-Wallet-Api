"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const port = env_1.envVars.port;
async function main() {
    try {
        await mongoose_1.default.connect(env_1.envVars.database_url);
        console.log('🛢️ Connected to MongoDB');
        app_1.default.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    }
    catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit if DB fails to connect
    }
}
main();
