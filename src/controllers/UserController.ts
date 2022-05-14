import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { validateEmail } from '@utils/validateEmail';
import UserRepository from '@repositories/UserRepository';
import S3StorageProvider from '@providers/S3StorageProvider';

interface CreateUserData extends User {
  confirm_password: string;
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
        error: 'All fields are required.',
      });
    }
    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return response.status(400).json({
        error: 'Invalid e-mail.',
      });
    }

    if (confirm_password !== password) {
      return response.status(400).json({
        error: 'Password/Confirm password does not match.',
      });
    }

    const checkUserExists = await UserRepository.findByEmail({
      email: email.toLowerCase().trim(),
    });

    if (checkUserExists) {
      return response.status(400).json({
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

    return response.status(201).json({
      message: 'User created.',
      data: user,
    });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const user = await UserRepository.findById({ id });

    if (!user) {
      return response.status(400).json({ error: 'User not found.' });
    }

    return response.json({ data: user });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const user = await UserRepository.delete({
      id,
    });

    return response.json({
      message: 'User deleted.',
      data: user,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const {
      name, email, password, confirm_password, filename,
    } = request.body;

    const checkUserExists = await UserRepository.findById({ id });

    if (!checkUserExists) {
      return response.status(400).json({ error: 'User not found.' });
    }
    // checar se usuario autenticado é um admin ou o proprio usuario

    if (!name || !email) {
      return response.status(400).json({ error: 'Name/e-mail required.' });
    }

    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return response.status(400).json({ error: 'Invalid e-mail.' });
    }

    const isEmailAlreadyUsed = await UserRepository.findByEmail({
      email: email.toLowerCase(),
    });

    if (isEmailAlreadyUsed && email.toLowerCase() !== isEmailAlreadyUsed.email) {
      return response.status(400).json({ error: 'E-mail already used.' });
    }

    let signedUrl = null;
    let fileId = null;

    if (filename) {
      fileId = `${uuidv4()}-${filename}`;

      const s3Storage = new S3StorageProvider();

      signedUrl = await s3Storage.generateSignedUrl(fileId);
    }

    if (!password) {
      const user = await UserRepository.update({
        id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
      });

      return response.json({
        message: 'User updated.',
        data: {
          ...user,
          avatar_url: signedUrl,
          avatar_id: fileId,
        },
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
      message: 'User updated.',
      data: {
        ...user,
        avatar_url: signedUrl,
        avatar_id: fileId,
      },
    });
  }
}

export default new UserController();
