import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async () => {
  try {
    if (!env.DATABASE_URL.startsWith('mongodb://') && !env.DATABASE_URL.startsWith('mongodb+srv://')) {
      console.warn(
        'DATABASE_URL does not look like a MongoDB connection string. Skipping database connection for now.'
      );
      return;
    }

    const conn = await mongoose.connect(env.DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    // Do not crash the dev server on DB failure; just run in degraded mode.
  }
};
