import UserController from '@controllers/UserController';
import { Request, Response, Router } from 'express';

const usersRouter = Router();

usersRouter.get('/users', (request:Request, response: Response) => response.json({ users: '/users online' }));
usersRouter.post('/users', UserController.store);

export default usersRouter;
