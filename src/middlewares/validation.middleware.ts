import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validate = (req: Request, res: Response, schema: z.ZodSchema<any>, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      res.status(400).json({ errors });
    } else {
      next(error);
    }
  }
};