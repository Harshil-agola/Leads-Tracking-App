import { Router } from 'express';
import { leadsController } from '../controllers/index.js';

const router: Router = Router();

router.get('/', leadsController.getLeads);
router.post('/', leadsController.createLead);

export default router;
