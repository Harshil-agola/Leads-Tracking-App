import type { Request, Response } from 'express';
import { ZodError } from 'zod';
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

	createLead = (req: Request, res: Response) => {
		try {
			const result = leadsService.createLead(req.body);
			return res.status(201).json({
				success: true,
				data: result,
			});
		} catch (err) {
			if (err instanceof ZodError) {
				return res.status(400).json({
					success: false,
					message: err.issues[0]?.message || 'Validation error',
					errors: err.issues.map((issue) => ({
						field: issue.path.join('.'),
						message: issue.message,
					})),
				});
			}

			if ((err as Error & { status?: number })?.status === 409) {
				return res.status(409).json({
					success: false,
					message: (err as Error).message,
				});
			}

			console.error('create lead controller error:', err);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	};

	deleteLead = (req: Request, res: Response) => {
		try {
			const id = Number(req.params.id);

			if (!id || Number.isNaN(id)) {
				return res.status(400).json({
					success: false,
					message: 'Invalid lead ID',
				});
			}

			leadsService.deleteLead(id);

			return res.status(200).json({
				success: true,
				message: 'Lead deleted successfully',
			});
		} catch (err) {
			if ((err as Error & { status?: number })?.status === 404) {
				return res.status(404).json({
					success: false,
					message: (err as Error).message,
				});
			}

			console.error('delete lead controller error:', err);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	};
}

export const leadsController = new LeadsController();
