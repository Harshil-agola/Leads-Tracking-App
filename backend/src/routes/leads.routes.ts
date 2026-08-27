import { Router } from 'express';
import { leadsController } from '../controllers/index.js';

const router: Router = Router();

router.get('/', leadsController.getLeads);

export default router;
