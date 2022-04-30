/* eslint-disable no-nested-ternary */
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { validateEmail } from '@utils/validateEmail';

interface CreateUserData {
  email: string;
  password: string;
  confirm_password: string;
}

interface UpdateUserData {
  email?: string;
  password?: string;
  confirm_password?: string;
}

interface GetUserParams {
  id: string
}

const users = [
  {
    id: uuidv4(),
    email: 'andre1@email.com',
    password: bcrypt.hashSync('123123', 8),
  },
];

class UserController {
  index(request: Request, response: Response) {
    return response.json({ users });
  }

  store(request: Request<{}, any, CreateUserData, any>, response: Response) {
    const {
      email, password, confirm_password,
    } = request.body;

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
      id: uuidv4(),
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    return response.json({
      status: 200,
      message: 'User created.',
      user: newUser,
    });
  }

  show(request: Request<GetUserParams>, response: Response) {
    const { id } = request.params;

    const user = users.find((item) => item.id === id);

    if (!user) {
      return response.status(400).json({ message: 'User not found.' });
    }

    return response.json({ user });
  }

  delete(request: Request<GetUserParams>, response: Response) {
    const { id } = request.params;

    users.filter((item) => item.id !== id);

    return response.json({
      status: 200,
      message: 'User deleted.',
    });
  }

  update(request: Request<GetUserParams, any, UpdateUserData>, response: Response) {
    const { id } = request.params;
    const { email = '', password = '', confirm_password = '' } = request.body;

    const checkUserExists = users.find((item) => item.id === id);

    // checar se usuario autenticado é um admin ou o proprio usuario

    if (!checkUserExists) {
      return response.status(400).json({ error: 'User not found.' });
    }

    if (!(email && validateEmail(email))) {
      return response.status(400).json({ error: 'Invalid e-mail.' });
    }

    if (confirm_password !== password) {
      return response.status(400).json({ error: 'Confirm password/password must be equal.' });
    }

    const updatedUsers = users.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          email,
          password:
            password !== ''
              ? bcrypt.hashSync(password, 8)
              : (item.password),

        };
      }

      return item;
    });

    return response.json({
      status: 200,
      message: 'User updated.',
      users: updatedUsers,
    });
  }
}

export default new UserController();
