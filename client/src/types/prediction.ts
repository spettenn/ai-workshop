export interface Prediction {
	id: string;
	userId: string;
	matchId: string;
	homeGoals: number;
	awayGoals: number;
	points: number;
	createdAt: string;
	updatedAt: string;
	// Populated fields
	user?: {
		id: string;
		name: string;
		department?: string;
	};
	match?: {
		id: string;
		homeTeam: string;
		awayTeam: string;
		kickoffTime: string;
		status: string;
		homeScore?: number;
		awayScore?: number;
	};
}

export interface CreatePredictionRequest {
	matchId: string;
	homeGoals: number;
	awayGoals: number;
}

export interface UpdatePredictionRequest {
	homeGoals: number;
	awayGoals: number;
}

export interface PredictionListResponse {
	predictions: Prediction[];
	total: number;
	page: number;
	limit: number;
}

export interface LeaderboardEntry {
	userId: string;
	userName: string;
	department?: string;
	totalPoints: number;
	totalPredictions: number;
	exactScores: number;
	correctWinners: number;
	rank: number;
}

export interface LeaderboardResponse {
	leaderboard: LeaderboardEntry[];
	userRank?: LeaderboardEntry;
}

export interface PredictionFilters {
	userId?: string;
	matchId?: string;
	page?: number;
	limit?: number;
}

// Scoring system constants
export const SCORING_RULES = {
	EXACT_SCORE: 3,
	CORRECT_WINNER_AND_DIFFERENCE: 2,
	CORRECT_WINNER_ONLY: 1,
	INCORRECT: 0,
} as const;

// Helper functions for scoring
export const calculatePredictionPoints = (
	prediction: { homeGoals: number; awayGoals: number },
	actualResult: { homeScore: number; awayScore: number }
): number => {
	const { homeGoals, awayGoals } = prediction;
	const { homeScore, awayScore } = actualResult;

	// Exact score match
	if (homeGoals === homeScore && awayGoals === awayScore) {
		return SCORING_RULES.EXACT_SCORE;
	}

	// Check if winner prediction is correct
	const predictedWinner =
		homeGoals > awayGoals ? 'home' : homeGoals < awayGoals ? 'away' : 'draw';
	const actualWinner =
		homeScore > awayScore ? 'home' : homeScore < awayScore ? 'away' : 'draw';

	if (predictedWinner !== actualWinner) {
		return SCORING_RULES.INCORRECT;
	}

	// Correct winner, check goal difference
	const predictedDifference = Math.abs(homeGoals - awayGoals);
	const actualDifference = Math.abs(homeScore - awayScore);

	if (predictedDifference === actualDifference) {
		return SCORING_RULES.CORRECT_WINNER_AND_DIFFERENCE;
	}

	// Correct winner only
	return SCORING_RULES.CORRECT_WINNER_ONLY;
};

export const getPredictionStatus = (
	kickoffTime: string
): 'open' | 'locked' | 'finished' => {
	const now = new Date();
	const kickoff = new Date(kickoffTime);

	if (now >= kickoff) {
		return 'locked';
	}

	return 'open';
};

export const getTimeUntilKickoff = (
	kickoffTime: string
): {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	isExpired: boolean;
} => {
	const now = new Date().getTime();
	const kickoff = new Date(kickoffTime).getTime();
	const difference = kickoff - now;

	if (difference <= 0) {
		return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
	}

	const days = Math.floor(difference / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((difference % (1000 * 60)) / 1000);

	return { days, hours, minutes, seconds, isExpired: false };
};
