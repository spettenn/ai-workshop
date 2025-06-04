export interface CreateMatchRequest {
	homeTeam: string;
	awayTeam: string;
	kickoffTime: string; // ISO string
	round?: string;
	venue?: string;
}

export interface UpdateMatchRequest {
	homeTeam?: string;
	awayTeam?: string;
	kickoffTime?: string;
	homeScore?: number;
	awayScore?: number;
	status?: MatchStatus;
	round?: string;
	venue?: string;
}

export interface MatchResponse {
	id: string;
	homeTeam: string;
	awayTeam: string;
	kickoffTime: string;
	status: MatchStatus;
	homeScore?: number;
	awayScore?: number;
	round?: string;
	venue?: string;
	createdAt: string;
	updatedAt: string;
}

export interface MatchFilters {
	status?: MatchStatus;
	round?: string;
	dateFrom?: string;
	dateTo?: string;
	team?: string; // Filter by home or away team
}

export enum MatchStatus {
	SCHEDULED = 'SCHEDULED',
	LIVE = 'LIVE',
	FINISHED = 'FINISHED',
	CANCELLED = 'CANCELLED',
}

export interface MatchListResponse {
	matches: MatchResponse[];
	total: number;
	page: number;
	limit: number;
}

// For real-time updates
export interface MatchUpdateEvent {
	matchId: string;
	type: 'SCORE_UPDATE' | 'STATUS_CHANGE' | 'MATCH_START' | 'MATCH_END';
	data: {
		homeScore?: number;
		awayScore?: number;
		status?: MatchStatus;
		timestamp: string;
	};
}
