'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { LeaderboardEntry, LeaderboardResponse } from '@/types/prediction';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardProps {
	showUserRank?: boolean;
	limit?: number;
}

export function Leaderboard({ showUserRank = true, limit }: LeaderboardProps) {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const { user } = useAuth();

	const fetchLeaderboard = async () => {
		try {
			const response: LeaderboardResponse = await apiService.getLeaderboard();

			let leaderboardData = response.leaderboard;
			if (limit) {
				leaderboardData = leaderboardData.slice(0, limit);
			}

			setLeaderboard(leaderboardData);
			setUserRank(response.userRank || null);
		} catch (error: any) {
			const message =
				error.response?.data?.error || 'Failed to fetch leaderboard';
			toast.error(message);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	};

	const handleRefresh = async () => {
		setIsRefreshing(true);
		await fetchLeaderboard();
	};

	useEffect(() => {
		fetchLeaderboard();
	}, []);

	const getRankBadgeVariant = (rank: number) => {
		if (rank === 1) return 'default'; // Gold
		if (rank === 2) return 'secondary'; // Silver
		if (rank === 3) return 'outline'; // Bronze
		return 'outline';
	};

	const getRankEmoji = (rank: number) => {
		if (rank === 1) return '🥇';
		if (rank === 2) return '🥈';
		if (rank === 3) return '🥉';
		return `#${rank}`;
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Leaderboard</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-center py-8'>Loading leaderboard...</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-4'>
			{/* User's Current Rank */}
			{showUserRank && userRank && (
				<Card className='border-blue-200 bg-blue-50'>
					<CardHeader className='pb-3'>
						<CardTitle className='text-lg'>Your Ranking</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-3'>
								<Badge
									variant={getRankBadgeVariant(userRank.rank)}
									className='text-lg px-3 py-1'>
									{getRankEmoji(userRank.rank)}
								</Badge>
								<div>
									<div className='font-medium'>{userRank.userName}</div>
									{userRank.department && (
										<div className='text-sm text-gray-500'>
											{userRank.department}
										</div>
									)}
								</div>
							</div>
							<div className='text-right'>
								<div className='text-2xl font-bold text-blue-600'>
									{userRank.totalPoints}
								</div>
								<div className='text-xs text-gray-500'>points</div>
							</div>
						</div>
						<div className='grid grid-cols-3 gap-4 mt-3 pt-3 border-t'>
							<div className='text-center'>
								<div className='text-lg font-semibold'>
									{userRank.totalPredictions}
								</div>
								<div className='text-xs text-gray-500'>Predictions</div>
							</div>
							<div className='text-center'>
								<div className='text-lg font-semibold text-green-600'>
									{userRank.exactScores}
								</div>
								<div className='text-xs text-gray-500'>Exact Scores</div>
							</div>
							<div className='text-center'>
								<div className='text-lg font-semibold text-blue-600'>
									{userRank.correctWinners}
								</div>
								<div className='text-xs text-gray-500'>Correct Winners</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Leaderboard Table */}
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div>
							<CardTitle>Leaderboard</CardTitle>
							<CardDescription>
								{limit
									? `Top ${limit} players`
									: 'All players ranked by points'}
							</CardDescription>
						</div>
						<Button
							variant='outline'
							size='sm'
							onClick={handleRefresh}
							disabled={isRefreshing}>
							{isRefreshing ? 'Refreshing...' : 'Refresh'}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{leaderboard.length === 0 ? (
						<div className='text-center py-8 text-gray-500'>
							No predictions yet. Be the first to make a prediction!
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-16'>Rank</TableHead>
									<TableHead>Player</TableHead>
									<TableHead className='text-center'>Points</TableHead>
									<TableHead className='text-center'>Predictions</TableHead>
									<TableHead className='text-center'>Exact</TableHead>
									<TableHead className='text-center'>Winners</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{leaderboard.map((entry) => (
									<TableRow
										key={entry.userId}
										className={entry.userId === user?.id ? 'bg-blue-50' : ''}>
										<TableCell>
											<Badge variant={getRankBadgeVariant(entry.rank)}>
												{getRankEmoji(entry.rank)}
											</Badge>
										</TableCell>
										<TableCell>
											<div>
												<div className='font-medium'>{entry.userName}</div>
												{entry.department && (
													<div className='text-sm text-gray-500'>
														{entry.department}
													</div>
												)}
											</div>
										</TableCell>
										<TableCell className='text-center'>
											<div className='text-lg font-semibold'>
												{entry.totalPoints}
											</div>
										</TableCell>
										<TableCell className='text-center'>
											{entry.totalPredictions}
										</TableCell>
										<TableCell className='text-center'>
											<span className='text-green-600 font-medium'>
												{entry.exactScores}
											</span>
										</TableCell>
										<TableCell className='text-center'>
											<span className='text-blue-600 font-medium'>
												{entry.correctWinners}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
