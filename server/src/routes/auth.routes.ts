import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me, refresh, register } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

export const authRouter = Router();

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Too many attempts. Try again later.' },
  },
});

authRouter.post('/register', authRateLimit, validateBody(registerSchema), asyncHandler(register));
authRouter.post('/login', authRateLimit, validateBody(loginSchema), asyncHandler(login));
authRouter.post('/refresh', asyncHandler(refresh));
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, asyncHandler(me));
