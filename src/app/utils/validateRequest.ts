import { ZodTypeAny } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: ZodTypeAny) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    next(err); // your global error handler handles this
  }
};
