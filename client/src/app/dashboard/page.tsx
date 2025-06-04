'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MatchCard } from '@/components/MatchCard';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { apiService } from '@/lib/api';
import { Match, MatchStatus, MatchFilters } from '@/types/match';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
	Prediction,
	getPredictionStatus,
	getTimeUntilKickoff,
} from '@/types/prediction';
import { PredictionForm } from '@/components/PredictionForm';
import { Leaderboard } from '@/components/Leaderboard';
import Link from 'next/link';

export default function DashboardPage() {
	const { user, logout, isLoading: authLoading } = useAuth();
	const { isConnected } = useSocket();
	const router = useRouter();
	const [matches, setMatches] = useState<Match[]>([]);
	const [mockMatches, setMockMatches] = useState<Match[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<'database' | 'mock'>('database');
	const [userPredictions, setUserPredictions] = useState<Prediction[]>([]);
	const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
	const [selectedPrediction, setSelectedPrediction] =
		useState<Prediction | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// Redirect if not authenticated
	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login');
		}
	}, [user, authLoading, router]);

	// Load matches
	useEffect(() => {
		const loadMatches = async () => {
			try {
				setIsLoading(true);

				// Load both database and mock matches
				const [dbResponse, mockResponse, predictionsResponse] =
					await Promise.all([
						apiService.getMatches({ limit: 20 }),
						apiService.getMockMatches({ limit: 20 }),
						apiService.getMyPredictions({ limit: 50 }),
					]);

				setMatches(dbResponse.matches);
				setMockMatches(mockResponse.matches);
				setUserPredictions(predictionsResponse.predictions);
			} catch (error) {
				console.error('Failed to load matches:', error);
				toast.error('Failed to load matches');
			} finally {
				setIsLoading(false);
			}
		};

		if (user) {
			loadMatches();
		}
	}, [user]);

	const handleMatchClick = (match: Match) => {
		toast.info(`Match details: ${match.homeTeam} vs ${match.awayTeam}`);
		// TODO: Navigate to match details or prediction form
	};

	const handleLogout = () => {
		logout();
		router.push('/login');
	};

	if (authLoading || !user) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-2 text-gray-600'>Loading...</p>
				</div>
			</div>
		);
	}

	const currentMatches = activeTab === 'database' ? matches : mockMatches;
	const liveMatches = currentMatches.filter(
		(m) => m.status === MatchStatus.LIVE
	);
	const upcomingMatches = currentMatches.filter(
		(m) => m.status === MatchStatus.SCHEDULED
	);
	const finishedMatches = currentMatches.filter(
		(m) => m.status === MatchStatus.FINISHED
	);

	const handlePredictionSuccess = () => {
		setIsDialogOpen(false);
		setSelectedMatch(null);
		setSelectedPrediction(null);
		// TODO: Refresh data
	};

	const openPredictionDialog = (match: Match) => {
		const existingPrediction = userPredictions.find(
			(p) => p.matchId === match.id
		);
		setSelectedMatch(match);
		setSelectedPrediction(existingPrediction || null);
		setIsDialogOpen(true);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getMatchStatusBadge = (match: Match) => {
		if (match.status === 'LIVE') {
			return <Badge className='bg-red-500 animate-pulse'>🔴 LIVE</Badge>;
		}
		if (match.status === 'FINISHED') {
			return <Badge variant='secondary'>✅ Finished</Badge>;
		}

		const predictionStatus = getPredictionStatus(match.kickoffTime);
		if (predictionStatus === 'locked') {
			return <Badge variant='destructive'>🔒 Locked</Badge>;
		}

		const timeLeft = getTimeUntilKickoff(match.kickoffTime);
		if (timeLeft.days > 0) {
			return (
				<Badge variant='outline'>
					⏰ {timeLeft.days}d {timeLeft.hours}h
				</Badge>
			);
		}
		if (timeLeft.hours > 0) {
			return (
				<Badge variant='outline'>
					⏰ {timeLeft.hours}h {timeLeft.minutes}m
				</Badge>
			);
		}
		if (timeLeft.minutes > 0) {
			return <Badge variant='default'>⏰ {timeLeft.minutes}m</Badge>;
		}

		return <Badge variant='default'>⏰ Soon</Badge>;
	};

	const getPredictionForMatch = (matchId: string) => {
		return userPredictions.find((p) => p.matchId === matchId);
	};

	const renderMatchCard = (match: Match, source: 'database' | 'mock') => {
		const prediction = getPredictionForMatch(match.id);
		const predictionStatus = getPredictionStatus(match.kickoffTime);
		const canPredict = predictionStatus === 'open';

		return (
			<Card
				key={`${source}-${match.id}`}
				className='hover:shadow-md transition-shadow'>
				<CardHeader className='pb-3'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-2'>
							{getMatchStatusBadge(match)}
							{source === 'mock' && (
								<Badge variant='outline' className='text-xs'>
									Mock
								</Badge>
							)}
						</div>
						<div className='flex items-center space-x-1'>
							<div className='w-2 h-2 rounded-full bg-green-500'></div>
							<span className='text-xs text-gray-500'>
								{isConnected ? 'Live' : 'Offline'}
							</span>
						</div>
					</div>
					<CardTitle className='text-lg'>
						{match.homeTeam} vs {match.awayTeam}
					</CardTitle>
					<CardDescription>
						{formatDate(match.kickoffTime)}
						{match.round && ` • ${match.round}`}
						{match.venue && ` • ${match.venue}`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Match Score */}
					<div className='text-center mb-4'>
						{match.status === 'FINISHED' || match.status === 'LIVE' ? (
							<div className='text-3xl font-bold'>
								{match.homeScore ?? 0} - {match.awayScore ?? 0}
							</div>
						) : (
							<div className='text-xl text-gray-400'>- : -</div>
						)}
					</div>

					{/* User's Prediction */}
					{prediction && (
						<div className='mb-4 p-3 bg-blue-50 rounded-lg'>
							<div className='text-sm font-medium text-center mb-1'>
								Your Prediction
							</div>
							<div className='text-lg font-bold text-center'>
								{prediction.homeGoals} - {prediction.awayGoals}
							</div>
							{prediction.points > 0 && (
								<div className='text-center mt-1'>
									<Badge className='bg-green-500'>
										+{prediction.points} points
									</Badge>
								</div>
							)}
						</div>
					)}

					{/* Action Button */}
					<div className='space-y-2'>
						{!prediction && canPredict && (
							<Button
								className='w-full'
								onClick={() => openPredictionDialog(match)}>
								Make Prediction
							</Button>
						)}

						{prediction && canPredict && (
							<Button
								variant='outline'
								className='w-full'
								onClick={() => openPredictionDialog(match)}>
								Edit Prediction
							</Button>
						)}

						{!canPredict && !prediction && (
							<Button variant='secondary' className='w-full' disabled>
								Predictions Locked
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		);
	};

	if (isLoading) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='text-center'>Loading dashboard...</div>
			</div>
		);
	}

	const totalMatches = matches.length + mockMatches.length;
	const liveMatchesCount = liveMatches.length;
	const finishedMatchesCount = finishedMatches.length;
	const totalPoints = userPredictions.reduce((sum, p) => sum + p.points, 0);

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-2'>Dashboard</h1>
				<p className='text-gray-600'>
					Welcome back, {user?.name}! Track matches and manage your predictions.
				</p>
			</div>

			{/* Statistics Cards */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-blue-600'>
							{totalPoints}
						</div>
						<div className='text-sm text-gray-500'>Your Points</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold'>{userPredictions.length}</div>
						<div className='text-sm text-gray-500'>Predictions Made</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-green-600'>
							{liveMatchesCount}
						</div>
						<div className='text-sm text-gray-500'>Live Matches</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold'>{finishedMatchesCount}</div>
						<div className='text-sm text-gray-500'>Finished Matches</div>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Matches Section */}
				<div className='lg:col-span-2'>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-2xl font-bold'>Matches</h2>
						<div className='space-x-2'>
							<Link href='/predictions'>
								<Button variant='outline' size='sm'>
									View All Predictions
								</Button>
							</Link>
						</div>
					</div>

					{totalMatches === 0 ? (
						<Card>
							<CardContent className='p-8 text-center'>
								<div className='text-gray-500'>No matches available</div>
							</CardContent>
						</Card>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							{/* Database Matches */}
							{matches
								.slice(0, 4)
								.map((match) => renderMatchCard(match, 'database'))}

							{/* Mock Matches (if we need more to fill the grid) */}
							{matches.length < 4 &&
								mockMatches
									.slice(0, 4 - matches.length)
									.map((match) => renderMatchCard(match, 'mock'))}
						</div>
					)}
				</div>

				{/* Leaderboard Section */}
				<div>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-2xl font-bold'>Leaderboard</h2>
						<Link href='/leaderboard'>
							<Button variant='outline' size='sm'>
								View Full
							</Button>
						</Link>
					</div>

					<Leaderboard showUserRank={true} limit={5} />
				</div>
			</div>

			{/* Prediction Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='max-w-md'>
					{selectedMatch && (
						<PredictionForm
							match={selectedMatch}
							existingPrediction={selectedPrediction || undefined}
							onSuccess={handlePredictionSuccess}
							onCancel={() => setIsDialogOpen(false)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
