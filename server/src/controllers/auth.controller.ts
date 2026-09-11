import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { findUserById } from '../repositories/user.repository.js';
import {
  loginUser,
  registerUser,
  refreshAccessToken,
  toSafeUser,
} from '../services/auth/auth.service.js';
import { verifyRefreshToken, REFRESH_TOKEN_TTL_MS } from '../services/auth/token.service.js';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_TTL_MS,
    path: '/api/v1/auth',
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });
}

export async function register(req: Request<unknown, unknown, RegisterInput>, res: Response) {
  const { accessToken, refreshToken, user } = await registerUser(req.body);
  setRefreshCookie(res, refreshToken);
  res.status(201).json({ success: true, data: { user, accessToken } });
}

export async function login(req: Request<unknown, unknown, LoginInput>, res: Response) {
  const { accessToken, refreshToken, user } = await loginUser(req.body);
  setRefreshCookie(res, refreshToken);
  res.json({ success: true, data: { user, accessToken } });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    throw new AppError(401, 'MISSING_REFRESH_TOKEN', 'No refresh token provided.');
  }

  let userId: string;
  try {
    userId = verifyRefreshToken(token).userId;
  } catch {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Invalid or expired refresh token.');
  }

  const user = await findUserById(userId);
  if (!user) {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'User no longer exists.');
  }

  const { accessToken, refreshToken } = refreshAccessToken(user.id);
  setRefreshCookie(res, refreshToken);
  res.json({ success: true, data: { user: toSafeUser(user), accessToken } });
}

export function logout(_req: Request, res: Response) {
  clearRefreshCookie(res);
  res.json({ success: true, data: {} });
}

export async function me(req: Request, res: Response) {
  const user = await findUserById(req.userId!);
  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found.');
  }
  res.json({ success: true, data: { user: toSafeUser(user) } });
}
