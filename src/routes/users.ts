import UserController from '@controllers/UserController';
import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/users', UserController.index);
usersRouter.get('/users/:id', UserController.show);
usersRouter.post('/users', UserController.store);
usersRouter.delete('/users/:id', UserController.delete);
usersRouter.put('/users/:id', UserController.update);

export default usersRouter;
