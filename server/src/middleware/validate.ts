import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // req.query is read-only in Express 5 typings; reassigning the parsed
    // result onto res.locals-adjacent req.query works fine at runtime under
    // Express 4, which is what this project uses.
    req.query = schema.parse(req.query) as typeof req.query;
    next();
  };
}
