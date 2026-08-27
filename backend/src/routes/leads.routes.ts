import { Router } from 'express';
import { leadsController } from '../controllers/index.js';

const router: Router = Router();

router.get('/', leadsController.getLeads);
router.post('/', leadsController.createLead);
router.patch('/:id', leadsController.updateLead);
router.delete('/:id', leadsController.deleteLead);

export default router;
