interface IMessageConfig {
  sms: {
    key: string;
    type: number;
  }
}

export default {
  sms: {
    key: process.env.APP_DEFAULT_SMS_KEY || '',
    type: 9,
  },
} as IMessageConfig;
