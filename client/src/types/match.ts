export enum MatchStatus {
	SCHEDULED = 'SCHEDULED',
	LIVE = 'LIVE',
	FINISHED = 'FINISHED',
	CANCELLED = 'CANCELLED',
}

export interface Match {
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

export interface MatchListResponse {
	matches: Match[];
	total: number;
	page: number;
	limit: number;
}

export interface MatchFilters {
	status?: MatchStatus;
	round?: string;
	dateFrom?: string;
	dateTo?: string;
	team?: string;
	page?: number;
	limit?: number;
}

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
