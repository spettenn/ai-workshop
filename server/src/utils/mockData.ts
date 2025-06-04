import { MatchStatus } from '../types/match';

export interface MockMatch {
	id: string;
	homeTeam: string;
	awayTeam: string;
	kickoffTime: Date;
	status: MatchStatus;
	homeScore?: number;
	awayScore?: number;
	round: string;
	venue: string;
}

// Extended World Cup 2026 mock data for local development
export const mockMatches: MockMatch[] = [
	// Group A
	{
		id: 'mock-1',
		homeTeam: 'Qatar',
		awayTeam: 'Ecuador',
		kickoffTime: new Date('2024-12-20T16:00:00Z'),
		status: MatchStatus.SCHEDULED,
		round: 'Group A',
		venue: 'Al Bayt Stadium',
	},
	{
		id: 'mock-2',
		homeTeam: 'Senegal',
		awayTeam: 'Netherlands',
		kickoffTime: new Date('2024-12-20T19:00:00Z'),
		status: MatchStatus.SCHEDULED,
		round: 'Group A',
		venue: 'Al Thumama Stadium',
	},

	// Group B
	{
		id: 'mock-3',
		homeTeam: 'England',
		awayTeam: 'Iran',
		kickoffTime: new Date('2024-12-21T13:00:00Z'),
		status: MatchStatus.LIVE,
		homeScore: 2,
		awayScore: 0,
		round: 'Group B',
		venue: 'Khalifa International Stadium',
	},
	{
		id: 'mock-4',
		homeTeam: 'USA',
		awayTeam: 'Wales',
		kickoffTime: new Date('2024-12-21T22:00:00Z'),
		status: MatchStatus.FINISHED,
		homeScore: 1,
		awayScore: 1,
		round: 'Group B',
		venue: 'Ahmad bin Ali Stadium',
	},

	// Group C
	{
		id: 'mock-5',
		homeTeam: 'Mexico',
		awayTeam: 'Poland',
		kickoffTime: new Date('2024-12-22T17:00:00Z'),
		status: MatchStatus.SCHEDULED,
		round: 'Group C',
		venue: 'Stadium 974',
	},

	// Group D
	{
		id: 'mock-6',
		homeTeam: 'Denmark',
		awayTeam: 'Tunisia',
		kickoffTime: new Date('2024-12-22T14:00:00Z'),
		status: MatchStatus.FINISHED,
		homeScore: 0,
		awayScore: 0,
		round: 'Group D',
		venue: 'Education City Stadium',
	},

	// Round of 16
	{
		id: 'mock-7',
		homeTeam: 'Brazil',
		awayTeam: 'South Korea',
		kickoffTime: new Date('2024-12-25T20:00:00Z'),
		status: MatchStatus.SCHEDULED,
		round: 'Round of 16',
		venue: 'Stadium 974',
	},
	{
		id: 'mock-8',
		homeTeam: 'Argentina',
		awayTeam: 'Australia',
		kickoffTime: new Date('2024-12-26T20:00:00Z'),
		status: MatchStatus.SCHEDULED,
		round: 'Round of 16',
		venue: 'Ahmad bin Ali Stadium',
	},
];

// Simulate API-Football response structure
export const generateMockApiResponse = (matches: MockMatch[]) => {
	return {
		get: 'fixtures',
		parameters: {
			league: '1',
			season: '2026',
		},
		errors: [],
		results: matches.length,
		paging: {
			current: 1,
			total: 1,
		},
		response: matches.map((match) => ({
			fixture: {
				id: match.id,
				referee: 'TBD',
				timezone: 'UTC',
				date: match.kickoffTime.toISOString(),
				timestamp: Math.floor(match.kickoffTime.getTime() / 1000),
				periods: {
					first: null,
					second: null,
				},
				venue: {
					id: null,
					name: match.venue,
					city: 'Doha',
				},
				status: {
					long: match.status,
					short:
						match.status === MatchStatus.SCHEDULED
							? 'NS'
							: match.status === MatchStatus.LIVE
								? '1H'
								: 'FT',
					elapsed: match.status === MatchStatus.LIVE ? 45 : null,
				},
			},
			league: {
				id: 1,
				name: 'World Cup',
				country: 'World',
				logo: 'https://media.api-sports.io/football/leagues/1.png',
				flag: null,
				season: 2026,
				round: match.round,
			},
			teams: {
				home: {
					id: null,
					name: match.homeTeam,
					logo: `https://media.api-sports.io/football/teams/${match.homeTeam.toLowerCase()}.png`,
					winner:
						match.homeScore && match.awayScore
							? match.homeScore > match.awayScore
							: null,
				},
				away: {
					id: null,
					name: match.awayTeam,
					logo: `https://media.api-sports.io/football/teams/${match.awayTeam.toLowerCase()}.png`,
					winner:
						match.homeScore && match.awayScore
							? match.awayScore > match.homeScore
							: null,
				},
			},
			goals: {
				home: match.homeScore || null,
				away: match.awayScore || null,
			},
			score: {
				halftime: {
					home:
						match.status === MatchStatus.LIVE
							? Math.floor((match.homeScore || 0) / 2)
							: null,
					away:
						match.status === MatchStatus.LIVE
							? Math.floor((match.awayScore || 0) / 2)
							: null,
				},
				fulltime: {
					home: match.status === MatchStatus.FINISHED ? match.homeScore : null,
					away: match.status === MatchStatus.FINISHED ? match.awayScore : null,
				},
				extratime: {
					home: null,
					away: null,
				},
				penalty: {
					home: null,
					away: null,
				},
			},
		})),
	};
};

// Helper function to get random match for live updates simulation
export const getRandomLiveMatch = (): MockMatch | null => {
	const liveMatches = mockMatches.filter((m) => m.status === MatchStatus.LIVE);
	if (liveMatches.length === 0) return null;
	return liveMatches[Math.floor(Math.random() * liveMatches.length)];
};

// Simulate score updates for live matches
export const simulateScoreUpdate = (match: MockMatch): MockMatch => {
	if (match.status !== MatchStatus.LIVE) return match;

	const shouldScore = Math.random() < 0.3; // 30% chance of scoring
	if (!shouldScore) return match;

	const homeScores = Math.random() < 0.5;
	return {
		...match,
		homeScore: homeScores ? (match.homeScore || 0) + 1 : match.homeScore || 0,
		awayScore: !homeScores ? (match.awayScore || 0) + 1 : match.awayScore || 0,
	};
};
