import { Router } from 'express';
import { leadsController } from '../controllers/index.js';

const router: Router = Router();

router.get('/', leadsController.getLeads);
router.get('/:id', leadsController.getLeadById);
router.get('/:id/notes', leadsController.getLeadNotes);

router.post('/', leadsController.createLead);
router.post('/:id/notes', leadsController.addNote);
router.patch('/:id/notes/:noteId', leadsController.updateNote);
router.delete('/:id/notes/:noteId', leadsController.deleteNote);
router.patch('/:id', leadsController.updateLead);
router.delete('/:id', leadsController.deleteLead);

export default router;
