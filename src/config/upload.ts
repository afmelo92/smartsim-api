interface IUploadConfig {
    aws: {
      bucket: string;
      bucket_url: string;
      default_avatar_filename: string;
    }
}

export default {
  aws: {
    bucket: `${process.env.S3_BUCKET_NAME}` || '',
    bucket_url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com`,
    default_avatar_filename: '09458201-babc-4675-826a-399ca5c99c8b-avatar.png',
  },
} as IUploadConfig;
