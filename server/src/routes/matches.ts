import express, { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import {
	CreateMatchRequest,
	UpdateMatchRequest,
	MatchResponse,
	MatchFilters,
	MatchStatus,
	MatchListResponse,
	MatchUpdateEvent,
} from '../types/match';
import {
	AuthenticatedRequest,
	authenticateToken,
	optionalAuth,
} from '../middleware/auth';
import { mockMatches, generateMockApiResponse } from '../utils/mockData';
import { io } from '../index';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createMatchSchema = z.object({
	homeTeam: z.string().min(2, 'Home team name must be at least 2 characters'),
	awayTeam: z.string().min(2, 'Away team name must be at least 2 characters'),
	kickoffTime: z.string().datetime('Invalid datetime format'),
	round: z.string().optional(),
	venue: z.string().optional(),
});

const updateMatchSchema = z.object({
	homeTeam: z.string().min(2).optional(),
	awayTeam: z.string().min(2).optional(),
	kickoffTime: z.string().datetime().optional(),
	homeScore: z.number().min(0).optional(),
	awayScore: z.number().min(0).optional(),
	status: z.nativeEnum(MatchStatus).optional(),
	round: z.string().optional(),
	venue: z.string().optional(),
});

const matchFiltersSchema = z.object({
	status: z.nativeEnum(MatchStatus).optional(),
	round: z.string().optional(),
	dateFrom: z.string().datetime().optional(),
	dateTo: z.string().datetime().optional(),
	team: z.string().optional(),
	page: z
		.string()
		.transform((val) => parseInt(val) || 1)
		.optional(),
	limit: z
		.string()
		.transform((val) => Math.min(parseInt(val) || 10, 50))
		.optional(),
});

/**
 * GET /api/matches
 * Get all matches with filtering and pagination
 */
router.get(
	'/',
	optionalAuth,
	async (req: Request, res: Response): Promise<void> => {
		try {
			const filters = matchFiltersSchema.parse(req.query);
			const page = filters.page || 1;
			const limit = filters.limit || 10;
			const skip = (page - 1) * limit;

			// Build where clause for database query
			const where: any = {};

			if (filters.status) {
				where.status = filters.status;
			}

			if (filters.round) {
				where.round = {
					contains: filters.round,
					mode: 'insensitive',
				};
			}

			if (filters.dateFrom || filters.dateTo) {
				where.kickoffTime = {};
				if (filters.dateFrom) {
					where.kickoffTime.gte = new Date(filters.dateFrom);
				}
				if (filters.dateTo) {
					where.kickoffTime.lte = new Date(filters.dateTo);
				}
			}

			if (filters.team) {
				where.OR = [
					{ homeTeam: { contains: filters.team, mode: 'insensitive' } },
					{ awayTeam: { contains: filters.team, mode: 'insensitive' } },
				];
			}

			// Get matches from database
			const [matches, total] = await Promise.all([
				prisma.match.findMany({
					where,
					orderBy: { kickoffTime: 'asc' },
					skip,
					take: limit,
				}),
				prisma.match.count({ where }),
			]);

			// Convert to response format
			const matchResponses: MatchResponse[] = matches.map((match) => ({
				id: match.id,
				homeTeam: match.homeTeam,
				awayTeam: match.awayTeam,
				kickoffTime: match.kickoffTime.toISOString(),
				status: match.status as MatchStatus,
				homeScore: match.homeScore || undefined,
				awayScore: match.awayScore || undefined,
				round: match.round || undefined,
				venue: match.venue || undefined,
				createdAt: match.createdAt.toISOString(),
				updatedAt: match.updatedAt.toISOString(),
			}));

			const response: MatchListResponse = {
				matches: matchResponses,
				total,
				page,
				limit,
			};

			res.json(response);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({
					error: 'Invalid query parameters',
					details: error.errors,
				});
				return;
			}

			console.error('Get matches error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * GET /api/matches/mock
 * Get mock matches for local development
 */
router.get('/mock', (req: Request, res: Response): void => {
	try {
		const filters = matchFiltersSchema.parse(req.query);
		let filteredMatches = [...mockMatches];

		// Apply filters
		if (filters.status) {
			filteredMatches = filteredMatches.filter(
				(m) => m.status === filters.status
			);
		}

		if (filters.round) {
			filteredMatches = filteredMatches.filter((m) =>
				m.round.toLowerCase().includes(filters.round!.toLowerCase())
			);
		}

		if (filters.team) {
			filteredMatches = filteredMatches.filter(
				(m) =>
					m.homeTeam.toLowerCase().includes(filters.team!.toLowerCase()) ||
					m.awayTeam.toLowerCase().includes(filters.team!.toLowerCase())
			);
		}

		// Pagination
		const page = filters.page || 1;
		const limit = filters.limit || 10;
		const skip = (page - 1) * limit;
		const paginatedMatches = filteredMatches.slice(skip, skip + limit);

		// Convert to response format
		const matchResponses: MatchResponse[] = paginatedMatches.map((match) => ({
			id: match.id,
			homeTeam: match.homeTeam,
			awayTeam: match.awayTeam,
			kickoffTime: match.kickoffTime.toISOString(),
			status: match.status,
			homeScore: match.homeScore,
			awayScore: match.awayScore,
			round: match.round,
			venue: match.venue,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}));

		const response: MatchListResponse = {
			matches: matchResponses,
			total: filteredMatches.length,
			page,
			limit,
		};

		res.json(response);
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json({
				error: 'Invalid query parameters',
				details: error.errors,
			});
			return;
		}

		console.error('Get mock matches error:', error);
		res.status(500).json({
			error: 'Internal server error',
		});
	}
});

/**
 * GET /api/matches/:id
 * Get specific match by ID
 */
router.get(
	'/:id',
	optionalAuth,
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			// Try database first
			const match = await prisma.match.findUnique({
				where: { id },
			});

			if (match) {
				const response: MatchResponse = {
					id: match.id,
					homeTeam: match.homeTeam,
					awayTeam: match.awayTeam,
					kickoffTime: match.kickoffTime.toISOString(),
					status: match.status as MatchStatus,
					homeScore: match.homeScore || undefined,
					awayScore: match.awayScore || undefined,
					round: match.round || undefined,
					venue: match.venue || undefined,
					createdAt: match.createdAt.toISOString(),
					updatedAt: match.updatedAt.toISOString(),
				};

				res.json(response);
				return;
			}

			// Fallback to mock data
			const mockMatch = mockMatches.find((m) => m.id === id);
			if (mockMatch) {
				const response: MatchResponse = {
					id: mockMatch.id,
					homeTeam: mockMatch.homeTeam,
					awayTeam: mockMatch.awayTeam,
					kickoffTime: mockMatch.kickoffTime.toISOString(),
					status: mockMatch.status,
					homeScore: mockMatch.homeScore,
					awayScore: mockMatch.awayScore,
					round: mockMatch.round,
					venue: mockMatch.venue,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				res.json(response);
				return;
			}

			res.status(404).json({
				error: 'Match not found',
			});
		} catch (error) {
			console.error('Get match error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * POST /api/matches
 * Create new match (protected route)
 */
router.post(
	'/',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			const validatedData = createMatchSchema.parse(req.body);

			const match = await prisma.match.create({
				data: {
					homeTeam: validatedData.homeTeam,
					awayTeam: validatedData.awayTeam,
					kickoffTime: new Date(validatedData.kickoffTime),
					round: validatedData.round,
					venue: validatedData.venue,
					status: MatchStatus.SCHEDULED,
				},
			});

			const response: MatchResponse = {
				id: match.id,
				homeTeam: match.homeTeam,
				awayTeam: match.awayTeam,
				kickoffTime: match.kickoffTime.toISOString(),
				status: match.status as MatchStatus,
				homeScore: match.homeScore || undefined,
				awayScore: match.awayScore || undefined,
				round: match.round || undefined,
				venue: match.venue || undefined,
				createdAt: match.createdAt.toISOString(),
				updatedAt: match.updatedAt.toISOString(),
			};

			// Emit real-time event
			io.emit('match:created', response);

			res.status(201).json(response);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({
					error: 'Validation failed',
					details: error.errors,
				});
				return;
			}

			console.error('Create match error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * PUT /api/matches/:id
 * Update match (protected route)
 */
router.put(
	'/:id',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const validatedData = updateMatchSchema.parse(req.body);

			const updateData: any = {};

			if (validatedData.homeTeam) updateData.homeTeam = validatedData.homeTeam;
			if (validatedData.awayTeam) updateData.awayTeam = validatedData.awayTeam;
			if (validatedData.kickoffTime)
				updateData.kickoffTime = new Date(validatedData.kickoffTime);
			if (validatedData.homeScore !== undefined)
				updateData.homeScore = validatedData.homeScore;
			if (validatedData.awayScore !== undefined)
				updateData.awayScore = validatedData.awayScore;
			if (validatedData.status) updateData.status = validatedData.status;
			if (validatedData.round) updateData.round = validatedData.round;
			if (validatedData.venue) updateData.venue = validatedData.venue;

			const match = await prisma.match.update({
				where: { id },
				data: updateData,
			});

			const response: MatchResponse = {
				id: match.id,
				homeTeam: match.homeTeam,
				awayTeam: match.awayTeam,
				kickoffTime: match.kickoffTime.toISOString(),
				status: match.status as MatchStatus,
				homeScore: match.homeScore || undefined,
				awayScore: match.awayScore || undefined,
				round: match.round || undefined,
				venue: match.venue || undefined,
				createdAt: match.createdAt.toISOString(),
				updatedAt: match.updatedAt.toISOString(),
			};

			// Emit real-time event for score/status updates
			if (
				validatedData.homeScore !== undefined ||
				validatedData.awayScore !== undefined ||
				validatedData.status
			) {
				const updateEvent: MatchUpdateEvent = {
					matchId: id,
					type: validatedData.status ? 'STATUS_CHANGE' : 'SCORE_UPDATE',
					data: {
						homeScore: validatedData.homeScore,
						awayScore: validatedData.awayScore,
						status: validatedData.status,
						timestamp: new Date().toISOString(),
					},
				};

				io.emit('match:updated', updateEvent);
				io.to(`match-${id}`).emit('match:score', updateEvent);
			}

			res.json(response);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({
					error: 'Validation failed',
					details: error.errors,
				});
				return;
			}

			console.error('Update match error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * DELETE /api/matches/:id
 * Delete match (protected route)
 */
router.delete(
	'/:id',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			await prisma.match.delete({
				where: { id },
			});

			// Emit real-time event
			io.emit('match:deleted', { matchId: id });

			res.status(204).send();
		} catch (error) {
			console.error('Delete match error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * GET /api/matches/api-football/simulate
 * Simulate API-Football response for testing
 */
router.get('/api-football/simulate', (req: Request, res: Response): void => {
	try {
		const mockApiResponse = generateMockApiResponse(mockMatches);
		res.json(mockApiResponse);
	} catch (error) {
		console.error('Simulate API-Football error:', error);
		res.status(500).json({
			error: 'Internal server error',
		});
	}
});

export default router;
