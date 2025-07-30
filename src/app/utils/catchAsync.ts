import { Request, Response, NextFunction, RequestHandler } from 'express';

// Define a higher-order function to wrap async route handlers
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

export default catchAsync;
