import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export const validateRequest = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;
    return next();
  };
};
