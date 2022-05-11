import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';

import CORSHandler from '@middlewares/CORSHandler';
import errorHandler from '@middlewares/ErrorHandler';

import usersRouter from '@routes/users.routes';
import sessionRouter from '@routes/session.routes';

process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line no-console
  console.error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`,
  );

  throw reason;
});

process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error(`App exiting due to an uncaught exception: ${error}`);
  process.exit(1);
});

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CORSHandler);

app.use(usersRouter);
app.use(sessionRouter);

app.use(errorHandler);

export default app;
