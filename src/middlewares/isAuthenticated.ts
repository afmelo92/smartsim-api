import auth from '@config/auth';
import UserRepository from '@repositories/UserRepository';
import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IUserTokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default async function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({
        error: 'JWT token missing.',
      });
    }

    const [, token] = authHeader.split(' ');

    const { secret } = auth.jwt;

    const decoded = verify(token, secret);

    const { sub } = decoded as IUserTokenPayload;

    const user = await UserRepository.findById({ id: sub });

    if (!user) {
      return response.status(401).json({
        error: 'Invalid user.',
      });
    }

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    return response.status(401).json({
      error: 'JWT token missing',
    });
  }
}
