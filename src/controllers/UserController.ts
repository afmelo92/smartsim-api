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

    return response.json(allUsers);
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

    const {
      id: userId, email, name, refer, credits, avatar,
    } = user;

    return response.json({
      id: userId, email, name, refer, credits, avatar,
    });
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
      name, email, password, confirm_password, filename, credits,
    } = request.body;
    const { admin } = request.user;

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

    const updateData = {
      id,
    };

    Object.defineProperties(updateData, {
      name: {
        configurable: true,
        writable: true,
        enumerable: true,
        value: name,
      },
      email: {
        configurable: true,
        writable: true,
        enumerable: true,
        value: email.toLowerCase(),
      },
    });

    let signedUrl = null;
    let fileId = null;

    if (filename) {
      fileId = `${uuidv4()}-${filename}`;

      const s3Storage = new S3StorageProvider();

      signedUrl = await s3Storage.generateSignedUrl(fileId);
    }

    if (password) {
      if (password !== confirm_password) {
        return response.status(400).json({ error: 'Confirm password/password must be equal.' });
      }

      const hashedPassword = bcrypt.hashSync(password.trim(), 8);

      Object.defineProperty(updateData, 'password', {
        configurable: true,
        writable: true,
        enumerable: true,
        value: hashedPassword,
      });
    }

    if ((credits >= 0) && admin) {
      Object.defineProperty(updateData, 'credits', {
        configurable: true,
        writable: true,
        enumerable: true,
        value: credits,
      });
    }

    const user = await UserRepository.update(updateData);

    return response.json({
      message: 'User updated.',
      ...user,
      avatar_url: signedUrl,
      avatar_id: fileId,
    });
  }
}

export default new UserController();
