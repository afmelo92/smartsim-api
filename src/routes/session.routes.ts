import { Router } from 'express';

import SessionController from '@controllers/SessionController';

const router = Router();

router.post('/session', SessionController.create);

export default router;
