/* eslint-disable no-nested-ternary */
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validateEmail } from '@utils/validateEmail';
import UserRepository from 'src/repositories/UserRepository';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

interface GetUserParams {
  id: string
}

class UserController {
  async index(request: Request, response: Response) {
    const allUsers = await UserRepository.findAll();

    return response.json({ users: allUsers });
  }

  async store(request: Request<{}, any, CreateUserData, any>, response: Response) {
    const {
      name, email, password, confirm_password,
    } = request.body;

    if (!name || !email || !password || !confirm_password) {
      return response.status(400).json({
        status: 400,
        error: 'All fields are required.',
      });
    }
    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return response.status(400).json({
        status: 400,
        error: 'Invalid e-mail.',
      });
    }

    if (confirm_password !== password) {
      return response.status(400).json({
        status: 400,
        error: 'Password/Confirm password does not match.',
      });
    }

    const checkUserExists = await UserRepository.findByEmail({
      email: email.toLowerCase().trim(),
    });

    if (checkUserExists) {
      return response.status(400).json({
        status: 400,
        error: 'E-mail already used.',
      });
    }

    // Checar se senha é forte

    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return response.json({
      status: 200,
      message: 'User created.',
      user,
    });
  }

  async show(request: Request<GetUserParams>, response: Response) {
    const { id } = request.params;

    const user = await UserRepository.findById({ id });

    if (!user) {
      return response.status(400).json({ error: 'User not found.' });
    }

    return response.json({ user });
  }

  async delete(request: Request<GetUserParams>, response: Response) {
    const { id } = request.params;

    const user = await UserRepository.delete({
      id,
    });

    return response.json({
      status: 200,
      message: 'User deleted.',
      user,
    });
  }

  async update(request: Request<GetUserParams, any, UpdateUserData>, response: Response) {
    const { id } = request.params;
    const {
      name, email, password, confirm_password,
    } = request.body;

    const checkUserExists = await UserRepository.findById({ id });

    // checar se usuario autenticado é um admin ou o proprio usuario

    if (!checkUserExists) {
      return response.status(400).json({ error: 'User not found.' });
    }

    if (!name || !email) {
      return response.status(400).json({ error: 'Name/e-mail required.' });
    }

    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return response.status(400).json({ error: 'Invalid e-mail.' });
    }

    if (!password) {
      const user = await UserRepository.update({
        id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
      });

      return response.json({
        status: 200,
        message: 'User updated.',
        user,
      });
    }

    if (password && password !== confirm_password) {
      return response.status(400).json({ error: 'Confirm password/password must be equal.' });
    }

    const hashedPassword = bcrypt.hashSync(password.trim(), 8);

    const user = await UserRepository.update({
      id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    return response.json({
      status: 200,
      message: 'User updated.',
      user,
    });
  }
}

export default new UserController();
