import { NextFunction, Request, Response } from 'express';

import UserRepository from '@repositories/UserRepository';

export default async function personalAction(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.params;
    const { user } = request;

    const checkAdmin = await UserRepository.findById({ id: user.id });

    if (id !== user.id && !checkAdmin?.admin) {
      return response.status(403).json({
        error: 'Unauthorized.',
      });
    }

    return next();
  } catch (error) {
    return response.status(403).json({
      error: 'JWT token missing',
    });
  }
}
