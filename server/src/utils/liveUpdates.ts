import { io } from '../index';
import {
	mockMatches,
	getRandomLiveMatch,
	simulateScoreUpdate,
} from './mockData';
import { MatchStatus, MatchUpdateEvent } from '../types/match';

let simulationInterval: NodeJS.Timeout | null = null;

/**
 * Start live score simulation for local development
 */
export const startLiveScoreSimulation = (): void => {
	if (simulationInterval) {
		console.log('Live score simulation already running');
		return;
	}

	console.log('🔴 Starting live score simulation...');

	simulationInterval = setInterval(() => {
		const liveMatch = getRandomLiveMatch();

		if (!liveMatch) {
			console.log('No live matches to simulate');
			return;
		}

		const updatedMatch = simulateScoreUpdate(liveMatch);

		// Check if score actually changed
		if (
			updatedMatch.homeScore !== liveMatch.homeScore ||
			updatedMatch.awayScore !== liveMatch.awayScore
		) {
			console.log(
				`⚽ Score update: ${updatedMatch.homeTeam} ${updatedMatch.homeScore} - ${updatedMatch.awayScore} ${updatedMatch.awayTeam}`
			);

			// Update the mock data
			const matchIndex = mockMatches.findIndex((m) => m.id === updatedMatch.id);
			if (matchIndex !== -1) {
				mockMatches[matchIndex] = updatedMatch;
			}

			// Emit real-time event
			const updateEvent: MatchUpdateEvent = {
				matchId: updatedMatch.id,
				type: 'SCORE_UPDATE',
				data: {
					homeScore: updatedMatch.homeScore,
					awayScore: updatedMatch.awayScore,
					timestamp: new Date().toISOString(),
				},
			};

			// Emit to all connected clients
			io.emit('match:updated', updateEvent);

			// Emit to specific match room
			io.to(`match-${updatedMatch.id}`).emit('match:score', updateEvent);
		}
	}, 10000); // Update every 10 seconds

	console.log('✅ Live score simulation started (updates every 10 seconds)');
};

/**
 * Stop live score simulation
 */
export const stopLiveScoreSimulation = (): void => {
	if (simulationInterval) {
		clearInterval(simulationInterval);
		simulationInterval = null;
		console.log('🛑 Live score simulation stopped');
	}
};

/**
 * Manually trigger a match status change
 */
export const simulateMatchStatusChange = (
	matchId: string,
	newStatus: MatchStatus
): boolean => {
	const matchIndex = mockMatches.findIndex((m) => m.id === matchId);

	if (matchIndex === -1) {
		console.log(`Match ${matchId} not found`);
		return false;
	}

	const oldStatus = mockMatches[matchIndex].status;
	mockMatches[matchIndex].status = newStatus;

	console.log(
		`📊 Status change: ${mockMatches[matchIndex].homeTeam} vs ${mockMatches[matchIndex].awayTeam} - ${oldStatus} → ${newStatus}`
	);

	// Emit real-time event
	const updateEvent: MatchUpdateEvent = {
		matchId,
		type: 'STATUS_CHANGE',
		data: {
			status: newStatus,
			timestamp: new Date().toISOString(),
		},
	};

	io.emit('match:updated', updateEvent);
	io.to(`match-${matchId}`).emit('match:status', updateEvent);

	return true;
};

/**
 * Get current simulation status
 */
export const getSimulationStatus = (): {
	running: boolean;
	liveMatches: number;
} => {
	const liveMatches = mockMatches.filter(
		(m) => m.status === MatchStatus.LIVE
	).length;

	return {
		running: simulationInterval !== null,
		liveMatches,
	};
};

/**
 * Initialize simulation on server start (for development)
 */
export const initializeLiveUpdates = (): void => {
	if (process.env.NODE_ENV === 'development') {
		// Start simulation after a short delay
		setTimeout(() => {
			startLiveScoreSimulation();
		}, 5000);
	}
};
