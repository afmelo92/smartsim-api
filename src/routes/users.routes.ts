import { Router } from 'express';

import UserController from '@controllers/UserController';
import isAdmin from '@middlewares/isAdmin';
import isAuthenticated from '@middlewares/isAuthenticated';
import personalAction from '@middlewares/personalAction';

const router = Router();

router.get('/users', isAuthenticated, isAdmin, UserController.index);
router.get('/users/:id', isAuthenticated, personalAction, UserController.show);
router.post('/users', UserController.store);
router.delete('/users/:id', isAuthenticated, personalAction, UserController.delete);
router.put('/users/:id', isAuthenticated, personalAction, UserController.update);

export default router;
