export default {
  jwt: {
    secret: process.env.APP_JWT_SECRET || 'default',
    expiresIn: '1d',
  },
};
