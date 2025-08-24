import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';

// ✅ Only connect to MongoDB, no app.listen()
async function main() {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(envVars.database_url);
      console.log('🛢️ Connected to MongoDB');
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if DB fails to connect
  }
}

main();

export default app; // ✅ Vercel will use this
