'use client';

import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Match, MatchStatus } from '@/types/match';

interface MatchCardProps {
	match: Match;
	onClick?: () => void;
}

const statusColors = {
	[MatchStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
	[MatchStatus.LIVE]: 'bg-red-100 text-red-800 animate-pulse',
	[MatchStatus.FINISHED]: 'bg-green-100 text-green-800',
	[MatchStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
	[MatchStatus.SCHEDULED]: 'Scheduled',
	[MatchStatus.LIVE]: 'Live',
	[MatchStatus.FINISHED]: 'Finished',
	[MatchStatus.CANCELLED]: 'Cancelled',
};

export function MatchCard({ match, onClick }: MatchCardProps) {
	const kickoffDate = new Date(match.kickoffTime);
	const isLive = match.status === MatchStatus.LIVE;
	const hasScore =
		match.homeScore !== undefined && match.awayScore !== undefined;

	return (
		<Card
			className={`cursor-pointer transition-all hover:shadow-md ${
				isLive ? 'ring-2 ring-red-200' : ''
			}`}
			onClick={onClick}>
			<CardHeader className='pb-2'>
				<div className='flex items-center justify-between'>
					<Badge className={statusColors[match.status]}>
						{statusLabels[match.status]}
					</Badge>
					{match.round && (
						<span className='text-xs text-gray-500'>{match.round}</span>
					)}
				</div>
			</CardHeader>

			<CardContent className='space-y-4'>
				{/* Teams and Score */}
				<div className='flex items-center justify-between'>
					<div className='flex-1'>
						<div className='flex items-center justify-between mb-2'>
							<span className='font-medium text-sm'>{match.homeTeam}</span>
							{hasScore && (
								<span
									className={`text-lg font-bold ${isLive ? 'text-red-600' : ''}`}>
									{match.homeScore}
								</span>
							)}
						</div>
						<div className='flex items-center justify-between'>
							<span className='font-medium text-sm'>{match.awayTeam}</span>
							{hasScore && (
								<span
									className={`text-lg font-bold ${isLive ? 'text-red-600' : ''}`}>
									{match.awayScore}
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Match Details */}
				<div className='text-xs text-gray-500 space-y-1'>
					<div className='flex items-center justify-between'>
						<span>📅 {format(kickoffDate, 'MMM dd, yyyy')}</span>
						<span>🕐 {format(kickoffDate, 'HH:mm')}</span>
					</div>
					{match.venue && <div>📍 {match.venue}</div>}
				</div>

				{/* Live Indicator */}
				{isLive && (
					<div className='flex items-center justify-center'>
						<div className='flex items-center space-x-2 text-red-600'>
							<div className='w-2 h-2 bg-red-600 rounded-full animate-pulse'></div>
							<span className='text-xs font-medium'>LIVE</span>
						</div>
					</div>
				)}

				{/* Prediction Placeholder */}
				{match.status === MatchStatus.SCHEDULED && (
					<div className='pt-2 border-t border-gray-100'>
						<div className='text-xs text-gray-400 text-center'>
							Click to make prediction
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
