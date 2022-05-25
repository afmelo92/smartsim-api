import {
  S3Client, PutObjectCommand, DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import upload from '@config/upload';

class S3StorageProvider {
  private client;

  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
      },
      region: `${process.env.AWS_MAIN_REGION}`,
    });
  }

  public async generateSignedUrl(fileId: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: `${upload.aws.bucket}`,
      Key: fileId,
      ACL: 'public-read',
    });

    return getSignedUrl(this.client, command, {
      expiresIn: 300,
    });
  }

  public async removeFile(fileId: string): Promise<any> {
    return this.client.send(
      new DeleteObjectCommand({ Bucket: `${upload.aws.bucket}`, Key: fileId }),
    );
  }
}

export default S3StorageProvider;
