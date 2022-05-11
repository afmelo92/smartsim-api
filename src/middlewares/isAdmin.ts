import { Request, Response, NextFunction } from 'express';

import UserRepository from '@repositories/UserRepository';

export default async function isAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const { user: requestUser } = request;

    if (!requestUser) {
      return response.status(403).json({
        error: 'JWT token missing',
      });
    }

    const user = await UserRepository.findById({ id: requestUser.id });

    if (!user) {
      return response.status(403).json({
        error: 'Invalid user.',
      });
    }

    const { admin } = user;

    if (!admin) {
      return response.status(403).json({
        error: 'Unauthorized.',
      });
    }

    return next();
  } catch (err) {
    return response.status(401).json({
      error: 'JWT token missing',
    });
  }
}
