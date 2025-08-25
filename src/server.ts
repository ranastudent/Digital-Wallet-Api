
import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';

const port = envVars.port;

async function main() {
  try {
   await mongoose.connect(envVars.database_url);

    console.log('🛢️ Connected to MongoDB');

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if DB fails to connect
  }
}


main();
