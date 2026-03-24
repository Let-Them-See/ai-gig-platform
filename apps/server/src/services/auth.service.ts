import { prisma } from '@gigforge/db';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import type { AuthTokens, AuthUser } from '@gigforge/types';

const SALT_ROUNDS = 12;

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: 'FREELANCER' | 'CLIENT'
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role,
      ...(role === 'FREELANCER'
        ? { freelancerProfile: { create: { skills: '[]' } } }
        : { clientProfile: { create: {} } }),
    },
  });

  const tokens = generateTokens(user.id, user.role);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'FREELANCER' | 'CLIENT',
      avatarUrl: user.avatarUrl,
    },
    tokens,
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  const tokens = generateTokens(user.id, user.role);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'FREELANCER' | 'CLIENT',
      avatarUrl: user.avatarUrl,
    },
    tokens,
  };
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const payload = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new Error('User not found');
  }
  return generateTokens(user.id, user.role);
}

export async function getUserById(userId: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as 'FREELANCER' | 'CLIENT',
    avatarUrl: user.avatarUrl,
  };
}

function generateTokens(userId: string, role: string): AuthTokens {
  return {
    accessToken: signAccessToken({ userId, role }),
    refreshToken: signRefreshToken({ userId, role }),
  };
}
