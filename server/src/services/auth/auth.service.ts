import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import { AppError } from '../../utils/AppError.js';
import { createUser, findUserByEmail } from '../../repositories/user.repository.js';
import { signAccessToken, signRefreshToken } from './token.service.js';
import type { RegisterInput, LoginInput } from '../../schemas/auth.schema.js';

const SALT_ROUNDS = 12;

export function toSafeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function issueTokens(userId: string) {
  return {
    accessToken: signAccessToken({ userId }),
    refreshToken: signRefreshToken({ userId }),
  };
}

export async function registerUser(input: RegisterInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new AppError(409, 'EMAIL_ALREADY_IN_USE', 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await createUser({ name: input.name, email: input.email, passwordHash });

  return { user: toSafeUser(user), ...issueTokens(user.id) };
}

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  return { user: toSafeUser(user), ...issueTokens(user.id) };
}

export function refreshAccessToken(userId: string) {
  return issueTokens(userId);
}
