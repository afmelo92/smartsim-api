interface IAuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
  }
}

export default {
  jwt: {
    secret: process.env.APP_JWT_SECRET || 'default',
    expiresIn: '1d',
  },
} as IAuthConfig;
