/* eslint-disable no-console */
import { Request, Response } from 'express';

const errorHandler = (err: Error, request: Request, response: Response) => {
  console.log('ERROR :::: ', err);
  response.status(500);
  response.json({ message: 'Oops! Something went wrong.' });
};

export default errorHandler;
