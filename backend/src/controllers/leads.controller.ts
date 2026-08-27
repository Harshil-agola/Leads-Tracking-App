import type { Request, Response } from 'express';
import { leadsService } from '../services/index.js';

export class LeadsController {
	getLeads = (req: Request, res: Response) => {
		try {
			const result = leadsService.getLeads(req.query);

			return res.status(200).json({
				success: true,
				data: result.leads,
				pagination: result.pagination,
			});
		} catch (err) {
			console.error('get leads controller error:', err);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	};
}

export const leadsController = new LeadsController();
