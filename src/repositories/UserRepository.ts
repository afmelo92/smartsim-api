import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

class UserRepository {
  async findAll(): Promise<User[]> {
    await prisma.$connect();

    const result = await prisma.user.findMany();

    await prisma.$disconnect();

    return result;
  }

  async findByEmail({ email }: Pick<User, 'email'>): Promise<User | null> {
    await prisma.$connect();

    const result = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    await prisma.$disconnect();

    return result;
  }

  async findById({ id }: Pick<User, 'id'>): Promise<User | null> {
    await prisma.$connect();

    const result = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    await prisma.$disconnect();

    return result;
  }

  async create({ name, email, password }: Pick<User, 'name' | 'email' | 'password'>): Promise<User> {
    await prisma.$connect();

    const result = await prisma.user.create({
      data: {
        name,
        email,
        password,
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
    id, name, email, password,
  }: Partial<User>):Promise<User> {
    await prisma.$connect();

    const result = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password,
      },
    });

    await prisma.$disconnect();

    return result;
  }
}

export default new UserRepository();
