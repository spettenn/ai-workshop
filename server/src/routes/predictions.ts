import express, { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createPredictionSchema = z.object({
	matchId: z.string().min(1, 'Match ID is required'),
	homeGoals: z
		.number()
		.min(0, 'Home goals must be 0 or greater')
		.max(20, 'Home goals must be 20 or less'),
	awayGoals: z
		.number()
		.min(0, 'Away goals must be 0 or greater')
		.max(20, 'Away goals must be 20 or less'),
});

const updatePredictionSchema = z.object({
	homeGoals: z
		.number()
		.min(0, 'Home goals must be 0 or greater')
		.max(20, 'Home goals must be 20 or less'),
	awayGoals: z
		.number()
		.min(0, 'Away goals must be 0 or greater')
		.max(20, 'Away goals must be 20 or less'),
});

const predictionFiltersSchema = z.object({
	userId: z.string().optional(),
	matchId: z.string().optional(),
	page: z
		.string()
		.transform((val) => parseInt(val) || 1)
		.optional(),
	limit: z
		.string()
		.transform((val) => Math.min(parseInt(val) || 10, 50))
		.optional(),
});

// Scoring logic
const calculatePredictionPoints = (
	prediction: { homeGoals: number; awayGoals: number },
	actualResult: { homeScore: number; awayScore: number }
): number => {
	const { homeGoals, awayGoals } = prediction;
	const { homeScore, awayScore } = actualResult;

	// Exact score match
	if (homeGoals === homeScore && awayGoals === awayScore) {
		return 3;
	}

	// Check if winner prediction is correct
	const predictedWinner =
		homeGoals > awayGoals ? 'home' : homeGoals < awayGoals ? 'away' : 'draw';
	const actualWinner =
		homeScore > awayScore ? 'home' : homeScore < awayScore ? 'away' : 'draw';

	if (predictedWinner !== actualWinner) {
		return 0;
	}

	// Correct winner, check goal difference
	const predictedDifference = Math.abs(homeGoals - awayGoals);
	const actualDifference = Math.abs(homeScore - awayScore);

	if (predictedDifference === actualDifference) {
		return 2;
	}

	// Correct winner only
	return 1;
};

/**
 * GET /api/predictions
 * Get predictions with filtering and pagination
 */
router.get(
	'/',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			const filters = predictionFiltersSchema.parse(req.query);
			const page = filters.page || 1;
			const limit = filters.limit || 10;
			const skip = (page - 1) * limit;

			// Build where clause
			const where: any = {};

			if (filters.userId) {
				where.userId = filters.userId;
			}

			if (filters.matchId) {
				where.matchId = filters.matchId;
			}

			// Get predictions with user and match data
			const [predictions, total] = await Promise.all([
				prisma.prediction.findMany({
					where,
					include: {
						user: {
							select: {
								id: true,
								name: true,
								department: true,
							},
						},
						match: {
							select: {
								id: true,
								homeTeam: true,
								awayTeam: true,
								kickoffTime: true,
								status: true,
								homeScore: true,
								awayScore: true,
							},
						},
					},
					orderBy: { createdAt: 'desc' },
					skip,
					take: limit,
				}),
				prisma.prediction.count({ where }),
			]);

			const response = {
				predictions: predictions.map((prediction) => ({
					id: prediction.id,
					userId: prediction.userId,
					matchId: prediction.matchId,
					homeGoals: prediction.homeGoals,
					awayGoals: prediction.awayGoals,
					points: prediction.points,
					createdAt: prediction.createdAt.toISOString(),
					updatedAt: prediction.updatedAt.toISOString(),
					user: prediction.user,
					match: prediction.match
						? {
								...prediction.match,
								kickoffTime: prediction.match.kickoffTime.toISOString(),
							}
						: undefined,
				})),
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

			console.error('Get predictions error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * GET /api/predictions/my
 * Get current user's predictions
 */
router.get(
	'/my',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			const filters = predictionFiltersSchema.parse(req.query);
			const page = filters.page || 1;
			const limit = filters.limit || 10;
			const skip = (page - 1) * limit;

			const where = { userId: req.user!.id };

			if (filters.matchId) {
				where.matchId = filters.matchId;
			}

			const [predictions, total] = await Promise.all([
				prisma.prediction.findMany({
					where,
					include: {
						match: {
							select: {
								id: true,
								homeTeam: true,
								awayTeam: true,
								kickoffTime: true,
								status: true,
								homeScore: true,
								awayScore: true,
								round: true,
								venue: true,
							},
						},
					},
					orderBy: { createdAt: 'desc' },
					skip,
					take: limit,
				}),
				prisma.prediction.count({ where }),
			]);

			const response = {
				predictions: predictions.map((prediction) => ({
					id: prediction.id,
					userId: prediction.userId,
					matchId: prediction.matchId,
					homeGoals: prediction.homeGoals,
					awayGoals: prediction.awayGoals,
					points: prediction.points,
					createdAt: prediction.createdAt.toISOString(),
					updatedAt: prediction.updatedAt.toISOString(),
					match: prediction.match
						? {
								...prediction.match,
								kickoffTime: prediction.match.kickoffTime.toISOString(),
							}
						: undefined,
				})),
				total,
				page,
				limit,
			};

			res.json(response);
		} catch (error) {
			console.error('Get my predictions error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * POST /api/predictions
 * Create a new prediction
 */
router.post(
	'/',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			const validatedData = createPredictionSchema.parse(req.body);

			// Check if match exists and is not started
			const match = await prisma.match.findUnique({
				where: { id: validatedData.matchId },
			});

			if (!match) {
				res.status(404).json({
					error: 'Match not found',
				});
				return;
			}

			// Check if match has already started
			if (new Date() >= match.kickoffTime) {
				res.status(400).json({
					error: 'Cannot create prediction after match has started',
				});
				return;
			}

			// Check if user already has a prediction for this match
			const existingPrediction = await prisma.prediction.findUnique({
				where: {
					userId_matchId: {
						userId: req.user!.id,
						matchId: validatedData.matchId,
					},
				},
			});

			if (existingPrediction) {
				res.status(400).json({
					error: 'Prediction already exists for this match',
				});
				return;
			}

			// Create prediction
			const prediction = await prisma.prediction.create({
				data: {
					userId: req.user!.id,
					matchId: validatedData.matchId,
					homeGoals: validatedData.homeGoals,
					awayGoals: validatedData.awayGoals,
					points: 0, // Points will be calculated when match finishes
				},
				include: {
					match: {
						select: {
							id: true,
							homeTeam: true,
							awayTeam: true,
							kickoffTime: true,
							status: true,
							homeScore: true,
							awayScore: true,
						},
					},
				},
			});

			const response = {
				id: prediction.id,
				userId: prediction.userId,
				matchId: prediction.matchId,
				homeGoals: prediction.homeGoals,
				awayGoals: prediction.awayGoals,
				points: prediction.points,
				createdAt: prediction.createdAt.toISOString(),
				updatedAt: prediction.updatedAt.toISOString(),
				match: prediction.match
					? {
							...prediction.match,
							kickoffTime: prediction.match.kickoffTime.toISOString(),
						}
					: undefined,
			};

			res.status(201).json(response);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({
					error: 'Validation failed',
					details: error.errors,
				});
				return;
			}

			console.error('Create prediction error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * PUT /api/predictions/:id
 * Update a prediction (only before match starts)
 */
router.put(
	'/:id',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const validatedData = updatePredictionSchema.parse(req.body);

			// Get prediction with match data
			const prediction = await prisma.prediction.findUnique({
				where: { id },
				include: { match: true },
			});

			if (!prediction) {
				res.status(404).json({
					error: 'Prediction not found',
				});
				return;
			}

			// Check if user owns this prediction
			if (prediction.userId !== req.user!.id) {
				res.status(403).json({
					error: 'Not authorized to update this prediction',
				});
				return;
			}

			// Check if match has already started
			if (new Date() >= prediction.match.kickoffTime) {
				res.status(400).json({
					error: 'Cannot update prediction after match has started',
				});
				return;
			}

			// Update prediction
			const updatedPrediction = await prisma.prediction.update({
				where: { id },
				data: {
					homeGoals: validatedData.homeGoals,
					awayGoals: validatedData.awayGoals,
				},
				include: {
					match: {
						select: {
							id: true,
							homeTeam: true,
							awayTeam: true,
							kickoffTime: true,
							status: true,
							homeScore: true,
							awayScore: true,
						},
					},
				},
			});

			const response = {
				id: updatedPrediction.id,
				userId: updatedPrediction.userId,
				matchId: updatedPrediction.matchId,
				homeGoals: updatedPrediction.homeGoals,
				awayGoals: updatedPrediction.awayGoals,
				points: updatedPrediction.points,
				createdAt: updatedPrediction.createdAt.toISOString(),
				updatedAt: updatedPrediction.updatedAt.toISOString(),
				match: updatedPrediction.match
					? {
							...updatedPrediction.match,
							kickoffTime: updatedPrediction.match.kickoffTime.toISOString(),
						}
					: undefined,
			};

			res.json(response);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({
					error: 'Validation failed',
					details: error.errors,
				});
				return;
			}

			console.error('Update prediction error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * DELETE /api/predictions/:id
 * Delete a prediction (only before match starts)
 */
router.delete(
	'/:id',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			// Get prediction with match data
			const prediction = await prisma.prediction.findUnique({
				where: { id },
				include: { match: true },
			});

			if (!prediction) {
				res.status(404).json({
					error: 'Prediction not found',
				});
				return;
			}

			// Check if user owns this prediction
			if (prediction.userId !== req.user!.id) {
				res.status(403).json({
					error: 'Not authorized to delete this prediction',
				});
				return;
			}

			// Check if match has already started
			if (new Date() >= prediction.match.kickoffTime) {
				res.status(400).json({
					error: 'Cannot delete prediction after match has started',
				});
				return;
			}

			// Delete prediction
			await prisma.prediction.delete({
				where: { id },
			});

			res.status(204).send();
		} catch (error) {
			console.error('Delete prediction error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * GET /api/predictions/leaderboard
 * Get leaderboard with user rankings
 */
router.get(
	'/leaderboard',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			// Get all users with their prediction statistics
			const users = await prisma.user.findMany({
				include: {
					predictions: {
						include: {
							match: true,
						},
					},
				},
			});

			// Calculate leaderboard entries
			const leaderboardEntries = users.map((user) => {
				const predictions = user.predictions;
				const totalPoints = predictions.reduce((sum, p) => sum + p.points, 0);
				const totalPredictions = predictions.length;
				const exactScores = predictions.filter((p) => p.points === 3).length;
				const correctWinners = predictions.filter((p) => p.points >= 1).length;

				return {
					userId: user.id,
					userName: user.name,
					department: user.department,
					totalPoints,
					totalPredictions,
					exactScores,
					correctWinners,
					rank: 0, // Will be set after sorting
				};
			});

			// Sort by total points (descending), then by total predictions (ascending)
			leaderboardEntries.sort((a, b) => {
				if (b.totalPoints !== a.totalPoints) {
					return b.totalPoints - a.totalPoints;
				}
				return a.totalPredictions - b.totalPredictions;
			});

			// Assign ranks
			leaderboardEntries.forEach((entry, index) => {
				entry.rank = index + 1;
			});

			// Find current user's rank
			const userRank = leaderboardEntries.find(
				(entry) => entry.userId === req.user!.id
			);

			const response = {
				leaderboard: leaderboardEntries,
				userRank,
			};

			res.json(response);
		} catch (error) {
			console.error('Get leaderboard error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

/**
 * POST /api/predictions/calculate-points
 * Recalculate points for all predictions (admin function)
 */
router.post(
	'/calculate-points',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			// Get all predictions for finished matches
			const predictions = await prisma.prediction.findMany({
				include: {
					match: true,
				},
				where: {
					match: {
						status: 'FINISHED',
						homeScore: { not: null },
						awayScore: { not: null },
					},
				},
			});

			let updatedCount = 0;

			// Calculate and update points for each prediction
			for (const prediction of predictions) {
				const match = prediction.match;
				if (match.homeScore !== null && match.awayScore !== null) {
					const points = calculatePredictionPoints(
						{
							homeGoals: prediction.homeGoals,
							awayGoals: prediction.awayGoals,
						},
						{ homeScore: match.homeScore, awayScore: match.awayScore }
					);

					if (points !== prediction.points) {
						await prisma.prediction.update({
							where: { id: prediction.id },
							data: { points },
						});
						updatedCount++;
					}
				}
			}

			res.json({
				message: `Points recalculated for ${updatedCount} predictions`,
				updatedCount,
			});
		} catch (error) {
			console.error('Calculate points error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

export default router;
