import SessionController from '@controllers/SessionController';
import { Router } from 'express';

const router = Router();

router.post('/session', SessionController.create);

export default router;
