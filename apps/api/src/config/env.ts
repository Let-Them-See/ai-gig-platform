import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().min(1),
  CLERK_SECRET_KEY: z.string().optional().default('sk_test_mock'),
  OPENAI_API_KEY: z.string().optional().default('sk-mock'),
  STRIPE_SECRET_KEY: z.string().optional().default('sk_test_mock'),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default('whsec_mock'),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default('mock'),
  CLOUDINARY_API_KEY: z.string().optional().default('mock'),
  CLOUDINARY_API_SECRET: z.string().optional().default('mock'),
  RESEND_API_KEY: z.string().optional().default('re_mock'),
  SENTRY_DSN: z.string().optional(),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:');
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;
