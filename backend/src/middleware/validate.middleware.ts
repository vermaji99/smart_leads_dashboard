import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodObject } from 'zod';
import ApiError from '../utils/ApiError';

const validate = (schema: ZodObject<any, any>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue: any) => ({
        path: issue.path.map((p: any) => String(p)).join('.'),
        message: issue.message,
      }));
      return next(new ApiError(400, 'Validation Error', errorMessages as any));
    }
    return next(new ApiError(500, 'Internal Server Error'));
  }
};

export default validate;
