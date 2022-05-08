/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, request: Request, response: Response, next: NextFunction) => {
  console.log('ERROR :::: ', err);
  return response.status(500).json({ message: 'Oops! Something went wrong.' });
};

export default errorHandler;
