import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router: Router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authMiddleware, authController.verify);

export default router;
