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
import Image from 'next/image';
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
			<div className='min-h-screen flex items-center justify-center hero-section'>
				<div className='text-center relative z-10'>
					<div className='w-20 h-16 relative mx-auto mb-6 animate-pulse'>
						<Image
							src='/eltek-logo.svg'
							alt='Eltek Holding'
							fill
							className='object-contain'
							priority
						/>
					</div>
					<h1 className='text-2xl font-semibold text-foreground mb-4'>
						Loading Dashboard...
					</h1>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
					<p className='mt-4 text-muted-foreground'>Please wait</p>
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
			return (
				<Badge className='bg-red-500 animate-pulse text-white'>🔴 LIVE</Badge>
			);
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
				className='card-hover border border-border'>
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
							<div
								className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
							<span className='text-xs text-muted-foreground'>
								{isConnected ? 'Live' : 'Offline'}
							</span>
						</div>
					</div>
					<CardTitle className='text-lg'>
						{match.homeTeam} vs {match.awayTeam}
					</CardTitle>
					<CardDescription>
						{formatDate(match.kickoffTime)}
						{match.venue && ` • ${match.venue}`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						{/* Match Score */}
						{match.status === MatchStatus.FINISHED && (
							<div className='text-center p-3 bg-muted rounded-lg'>
								<div className='text-2xl font-bold text-foreground'>
									{match.homeScore} - {match.awayScore}
								</div>
								<div className='text-sm text-muted-foreground'>Final Score</div>
							</div>
						)}

						{/* User Prediction */}
						{prediction && (
							<div className='p-3 bg-primary/5 border border-primary/20 rounded-lg'>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium text-foreground'>
										Your Prediction:
									</span>
									<span className='text-sm font-bold text-primary'>
										{prediction.homeScore} - {prediction.awayScore}
									</span>
								</div>
								{prediction.points !== null && (
									<div className='text-xs text-muted-foreground mt-1'>
										Points earned: {prediction.points}
									</div>
								)}
							</div>
						)}

						{/* Action Button */}
						<div className='flex justify-center'>
							{canPredict ? (
								<Button
									onClick={() => openPredictionDialog(match)}
									size='sm'
									className='btn-animate'>
									{prediction ? 'Update Prediction' : 'Make Prediction'}
								</Button>
							) : (
								<Button variant='outline' size='sm' disabled>
									{match.status === MatchStatus.FINISHED
										? 'Match Finished'
										: 'Predictions Locked'}
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className='min-h-screen bg-background'>
			{/* Hero Section */}
			<div className='eltek-gradient border-b border-border'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='text-center'>
						<h1 className='text-4xl font-bold text-foreground mb-4'>
							Welcome back, {user.name}!
						</h1>
						<p className='text-xl text-muted-foreground mb-8'>
							Track your predictions and compete with your colleagues
						</p>

						{/* Quick Stats */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto'>
							<div className='bg-card rounded-xl p-4 shadow-sm border border-border'>
								<div className='text-2xl font-bold text-primary'>
									{userPredictions.length}
								</div>
								<div className='text-sm text-muted-foreground'>
									Predictions Made
								</div>
							</div>
							<div className='bg-card rounded-xl p-4 shadow-sm border border-border'>
								<div className='text-2xl font-bold text-primary'>
									{liveMatches.length}
								</div>
								<div className='text-sm text-muted-foreground'>
									Live Matches
								</div>
							</div>
							<div className='bg-card rounded-xl p-4 shadow-sm border border-border'>
								<div className='text-2xl font-bold text-primary'>
									{upcomingMatches.length}
								</div>
								<div className='text-sm text-muted-foreground'>
									Upcoming Matches
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Tab Navigation */}
				<div className='flex items-center justify-center mb-8'>
					<div className='bg-muted p-1 rounded-lg'>
						<Button
							variant={activeTab === 'database' ? 'default' : 'ghost'}
							size='sm'
							onClick={() => setActiveTab('database')}
							className='btn-animate'>
							Database Matches
						</Button>
						<Button
							variant={activeTab === 'mock' ? 'default' : 'ghost'}
							size='sm'
							onClick={() => setActiveTab('mock')}
							className='btn-animate'>
							Mock Matches
						</Button>
					</div>
				</div>

				{isLoading ? (
					<div className='text-center py-12'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
						<p className='text-muted-foreground'>Loading matches...</p>
					</div>
				) : (
					<div className='space-y-8'>
						{/* Live Matches */}
						{liveMatches.length > 0 && (
							<section>
								<h2 className='text-2xl font-semibold text-foreground mb-4 flex items-center'>
									🔴 Live Matches
									<Badge className='ml-2 bg-red-500 animate-pulse text-white'>
										{liveMatches.length}
									</Badge>
								</h2>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{liveMatches.map((match) =>
										renderMatchCard(match, activeTab)
									)}
								</div>
							</section>
						)}

						{/* Upcoming Matches */}
						{upcomingMatches.length > 0 && (
							<section>
								<h2 className='text-2xl font-semibold text-foreground mb-4 flex items-center'>
									⏰ Upcoming Matches
									<Badge variant='outline' className='ml-2'>
										{upcomingMatches.length}
									</Badge>
								</h2>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{upcomingMatches.map((match) =>
										renderMatchCard(match, activeTab)
									)}
								</div>
							</section>
						)}

						{/* Finished Matches */}
						{finishedMatches.length > 0 && (
							<section>
								<h2 className='text-2xl font-semibold text-foreground mb-4 flex items-center'>
									✅ Finished Matches
									<Badge variant='secondary' className='ml-2'>
										{finishedMatches.length}
									</Badge>
								</h2>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{finishedMatches
										.slice(0, 6)
										.map((match) => renderMatchCard(match, activeTab))}
								</div>
								{finishedMatches.length > 6 && (
									<div className='text-center mt-6'>
										<Link href='/predictions'>
											<Button variant='outline' className='btn-animate'>
												View All Matches
											</Button>
										</Link>
									</div>
								)}
							</section>
						)}

						{/* Empty State */}
						{currentMatches.length === 0 && (
							<div className='text-center py-12'>
								<div className='text-6xl mb-4'>⚽</div>
								<h3 className='text-xl font-semibold text-foreground mb-2'>
									No matches available
								</h3>
								<p className='text-muted-foreground'>
									Check back later for upcoming matches
								</p>
							</div>
						)}

						{/* Quick Actions */}
						<div className='bg-muted/30 rounded-xl p-8 text-center'>
							<h3 className='text-xl font-semibold text-foreground mb-4'>
								Quick Actions
							</h3>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<Link href='/predictions'>
									<Button className='btn-animate'>View All Predictions</Button>
								</Link>
								<Link href='/leaderboard'>
									<Button variant='outline' className='btn-animate'>
										Check Leaderboard
									</Button>
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Prediction Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='max-w-md'>
					{selectedMatch && (
						<PredictionForm
							match={selectedMatch}
							existingPrediction={selectedPrediction}
							onSuccess={handlePredictionSuccess}
							onCancel={() => setIsDialogOpen(false)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
