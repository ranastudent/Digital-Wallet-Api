import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

if (!process.env.JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in .env');
}

export const envVars = {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL as string,
  jwt: {
    secret: process.env.JWT_SECRET as string, // now guaranteed to be string
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};
