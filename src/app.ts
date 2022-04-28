import express from 'express';
import helmet from 'helmet';
import CORSHandler from '@middlewares/CORSHandler';
import errorHandler from '@middlewares/ErrorHandler';
import usersRouter from '@routes/users';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CORSHandler);

app.use(usersRouter);

app.use(errorHandler);

export default app;
