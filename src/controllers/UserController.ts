import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { validateEmail } from '@utils/validateEmail';

interface CreateUserData {
  email: string;
  password: string;
  confirm_password: string;
}

const users = [
  {
    email: 'andre1@email.com',
    password: '123123',
  },
];

class UserController {
  store(request: Request, response: Response) {
    const { email, password, confirm_password }: CreateUserData = request.body;

    if (!email || !password || !confirm_password) {
      return response.status(400).json({
        status: 400,
        message: 'All fields are required.',
      });
    }
    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return response.status(400).json({
        status: 400,
        message: 'Invalid e-mail.',
      });
    }

    if (confirm_password !== password) {
      return response.status(400).json({
        status: 400,
        message: 'Password/Confirm password does not match.',
      });
    }

    const checkUserExists = users.find((item) => item.email === email);

    if (checkUserExists) {
      return response.status(400).json({
        status: 400,
        message: 'E-mail already used.',
      });
    }

    // Checar se senha é forte

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = {
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    return response.json({ message: 'User created.' });
  }
}

export default new UserController();
