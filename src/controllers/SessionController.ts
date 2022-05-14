import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import UserRepository from '@repositories/UserRepository';
import auth from '@config/auth';

type SessionBodyParams = {
  email: string
  password: string
}

class SessionController {
  async create(
    request: Request<{}, any, SessionBodyParams>,
    response: Response,
  ): Promise<Response> {
    const { email, password } = request.body;

    const user = await UserRepository.findByEmail({ email });

    if (!user) {
      return response.status(400).json({ error: 'Incorrect email/password combination.' });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return response.status(400).json({ error: 'Incorrect email/password combination.' });
    }

    const { expiresIn, secret } = auth.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return response.json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
      },
      token,
    });
  }
}

export default new SessionController();
