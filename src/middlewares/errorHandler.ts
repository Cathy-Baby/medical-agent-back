import express from 'express';

export const errorHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server Error',
    message: err.message
  });
};
