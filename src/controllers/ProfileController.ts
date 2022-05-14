import { Request, Response } from 'express';
import UserRepository from '@repositories/UserRepository';
import upload from '@config/upload';
import S3StorageProvider from '@providers/S3StorageProvider';

class ProfileController {
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { avatar_id } = request.body;

    const checkUserExists = await UserRepository.findById({ id });

    if (!checkUserExists) {
      return response.status(400).json({ error: 'User not found.' });
    }

    if (!avatar_id) {
      return response.status(400).json({ error: 'Avatar not found.' });
    }

    const { default_avatar_filename, bucket_url } = upload.aws;

    const defaultAvatarUrl = `${bucket_url}/${default_avatar_filename}`;

    if (checkUserExists.avatar !== defaultAvatarUrl) {
      const { pathname } = new URL(checkUserExists?.avatar!);

      const s3Storage = new S3StorageProvider();

      await s3Storage.removeFile(pathname.slice(1));
    }

    await UserRepository.update({
      id,
      avatar: `${upload.aws.bucket_url}/${avatar_id}`,
    });

    return response.status(200).end();
  }
}

export default new ProfileController();
