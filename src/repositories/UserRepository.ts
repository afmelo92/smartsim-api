import { PrismaClient, User } from '@prisma/client';

import message from '@config/message';
import upload from '@config/upload';

const prisma = new PrismaClient();

class UserRepository {
  async findAll(): Promise<Partial<User>[]> {
    await prisma.$connect();

    const result = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        refer: true,
        sms_key: true,
        credits: true,
        admin: true,
        messages: true,
        avatar: true,
        _count: true,
      },
    });

    await prisma.$disconnect();

    return result;
  }

  async findByEmail({ email }: Pick<User, 'email'>): Promise<User | null> {
    await prisma.$connect();

    const result = await prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        messages: true,
      },
    });

    await prisma.$disconnect();

    return result;
  }

  async findById({ id }: Pick<User, 'id'>): Promise<Partial<User> | null> {
    await prisma.$connect();

    const result = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        refer: true,
        sms_key: true,
        credits: true,
        admin: true,
        messages: true,
        avatar: true,
        _count: true,
      },
    });

    await prisma.$disconnect();

    return result;
  }

  async create({
    name,
    email,
    password,
  }: Pick<User, 'name' | 'email' | 'password'>): Promise<Partial<User> | null> {
    await prisma.$connect();

    const { key } = message.sms;
    const { bucket_url, default_avatar_filename } = upload.aws;

    const result = await prisma.user.create({
      data: {
        name,
        email,
        password,
        sms_key: key,
        credits: 0,
        avatar: `${bucket_url}/${default_avatar_filename}`,
      },
      select: {
        id: true,
        name: true,
        email: true,
        messages: true,
      },
    });

    await prisma.$disconnect();

    return result;
  }

  async delete({
    id,
  }: Pick<User, 'id'>): Promise<User> {
    await prisma.$connect();

    const result = await prisma.user.delete({
      where: {
        id,
      },
    });

    await prisma.$disconnect();

    return result;
  }

  async update({
    id, name, email, password, avatar, credits,
  }: Partial<User>):Promise<Partial<User>> {
    await prisma.$connect();

    const result = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password,
        avatar,
        credits,
      },
      select: {
        id: true,
        email: true,
        name: true,
        refer: true,
        credits: true,
        messages: true,
        avatar: true,
      },
    });

    await prisma.$disconnect();

    return result;
  }
}

export default new UserRepository();
