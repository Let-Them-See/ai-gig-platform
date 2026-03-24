import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().default('file:../../prisma/dev.db'),
  JWT_ACCESS_SECRET: z.string().min(1).default('dev_access_secret_change_me'),
  JWT_REFRESH_SECRET: z.string().min(1).default('dev_refresh_secret_change_me'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  STRIPE_SECRET_KEY: z.string().optional().default('sk_test_mock'),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default('whsec_mock'),
  OPENAI_API_KEY: z.string().optional(),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:');
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;
