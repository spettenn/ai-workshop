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
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Prediction,
	PredictionListResponse,
	getPredictionStatus,
	getTimeUntilKickoff,
} from '@/types/prediction';
import { Match } from '@/types/match';
import { PredictionForm } from '@/components/PredictionForm';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function PredictionsPage() {
	const [predictions, setPredictions] = useState<Prediction[]>([]);
	const [availableMatches, setAvailableMatches] = useState<Match[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
	const [selectedPrediction, setSelectedPrediction] =
		useState<Prediction | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { user } = useAuth();

	const fetchData = async () => {
		try {
			setIsLoading(true);

			// Fetch user's predictions and available matches
			const [predictionsResponse, dbMatches, mockMatches] = await Promise.all([
				apiService.getMyPredictions({ limit: 50 }),
				apiService.getMatches({ limit: 50 }),
				apiService.getMockMatches({ limit: 50 }),
			]);

			setPredictions(predictionsResponse.predictions);

			// Combine database and mock matches
			const allMatches = [...dbMatches.matches, ...mockMatches.matches];

			// Filter out matches that have already started (for new predictions)
			const openMatches = allMatches.filter(
				(match) => getPredictionStatus(match.kickoffTime) === 'open'
			);

			setAvailableMatches(openMatches);
		} catch (error: any) {
			const message = error.response?.data?.error || 'Failed to fetch data';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handlePredictionSuccess = () => {
		setIsDialogOpen(false);
		setSelectedMatch(null);
		setSelectedPrediction(null);
		fetchData(); // Refresh data
	};

	const openPredictionDialog = (match: Match, prediction?: Prediction) => {
		setSelectedMatch(match);
		setSelectedPrediction(prediction || null);
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

	const getStatusBadge = (prediction: Prediction) => {
		if (!prediction.match) return null;

		const status = getPredictionStatus(prediction.match.kickoffTime);

		if (status === 'locked' && prediction.match.status === 'FINISHED') {
			if (prediction.points === 3) {
				return <Badge className='bg-green-500'>🎯 Exact Score (+3)</Badge>;
			} else if (prediction.points === 2) {
				return <Badge className='bg-blue-500'>🎲 Winner + Diff (+2)</Badge>;
			} else if (prediction.points === 1) {
				return <Badge className='bg-yellow-500'>✅ Winner (+1)</Badge>;
			} else {
				return <Badge variant='destructive'>❌ Incorrect (0)</Badge>;
			}
		}

		if (status === 'locked') {
			return <Badge variant='secondary'>🔒 Locked</Badge>;
		}

		const timeLeft = getTimeUntilKickoff(prediction.match.kickoffTime);
		if (timeLeft.isExpired) {
			return <Badge variant='destructive'>⏰ Expired</Badge>;
		}

		return <Badge variant='default'>⏰ Open</Badge>;
	};

	if (isLoading) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='text-center'>Loading predictions...</div>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-2'>My Predictions</h1>
				<p className='text-gray-600'>
					Manage your match predictions and track your performance
				</p>
			</div>

			{/* Statistics Cards */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-blue-600'>
							{predictions.reduce((sum, p) => sum + p.points, 0)}
						</div>
						<div className='text-sm text-gray-500'>Total Points</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold'>{predictions.length}</div>
						<div className='text-sm text-gray-500'>Predictions Made</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-green-600'>
							{predictions.filter((p) => p.points === 3).length}
						</div>
						<div className='text-sm text-gray-500'>Exact Scores</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-yellow-600'>
							{predictions.filter((p) => p.points >= 1).length}
						</div>
						<div className='text-sm text-gray-500'>Correct Winners</div>
					</CardContent>
				</Card>
			</div>

			{/* Available Matches for New Predictions */}
			{availableMatches.length > 0 && (
				<Card className='mb-8'>
					<CardHeader>
						<CardTitle>Available Matches</CardTitle>
						<CardDescription>
							Make predictions for upcoming matches
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{availableMatches
								.filter(
									(match) => !predictions.some((p) => p.matchId === match.id)
								)
								.slice(0, 6)
								.map((match) => (
									<Card
										key={match.id}
										className='cursor-pointer hover:shadow-md transition-shadow'>
										<CardContent className='p-4'>
											<div className='text-center mb-2'>
												<div className='font-medium text-sm'>
													{match.homeTeam} vs {match.awayTeam}
												</div>
												<div className='text-xs text-gray-500'>
													{formatDate(match.kickoffTime)}
												</div>
												{match.round && (
													<Badge variant='outline' className='mt-1 text-xs'>
														{match.round}
													</Badge>
												)}
											</div>
											<Button
												size='sm'
												className='w-full'
												onClick={() => openPredictionDialog(match)}>
												Make Prediction
											</Button>
										</CardContent>
									</Card>
								))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* User's Predictions */}
			<Card>
				<CardHeader>
					<CardTitle>Your Predictions</CardTitle>
					<CardDescription>
						{predictions.length === 0
							? 'No predictions yet. Start by making your first prediction!'
							: `${predictions.length} prediction${predictions.length === 1 ? '' : 's'} made`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{predictions.length === 0 ? (
						<div className='text-center py-8 text-gray-500'>
							<div className='mb-4'>⚽ No predictions yet</div>
							<p>Make your first prediction to get started!</p>
						</div>
					) : (
						<div className='space-y-4'>
							{predictions.map((prediction) => (
								<Card
									key={prediction.id}
									className='border-l-4 border-l-blue-500'>
									<CardContent className='p-4'>
										<div className='flex items-center justify-between'>
											<div className='flex-1'>
												<div className='flex items-center space-x-4'>
													<div className='text-center'>
														<div className='font-medium text-sm'>
															{prediction.match?.homeTeam || 'Unknown'} vs{' '}
															{prediction.match?.awayTeam || 'Unknown'}
														</div>
														<div className='text-xs text-gray-500'>
															{prediction.match &&
																formatDate(prediction.match.kickoffTime)}
														</div>
														{prediction.match?.round && (
															<Badge variant='outline' className='mt-1 text-xs'>
																{prediction.match.round}
															</Badge>
														)}
													</div>

													<div className='text-center'>
														<div className='text-lg font-bold'>
															{prediction.homeGoals} - {prediction.awayGoals}
														</div>
														<div className='text-xs text-gray-500'>
															Your Prediction
														</div>
													</div>

													{prediction.match?.homeScore !== null &&
														prediction.match?.awayScore !== null && (
															<div className='text-center'>
																<div className='text-lg font-bold text-green-600'>
																	{prediction.match.homeScore} -{' '}
																	{prediction.match.awayScore}
																</div>
																<div className='text-xs text-gray-500'>
																	Final Score
																</div>
															</div>
														)}
												</div>
											</div>

											<div className='flex items-center space-x-2'>
												{getStatusBadge(prediction)}

												{prediction.match &&
													getPredictionStatus(prediction.match.kickoffTime) ===
														'open' && (
														<Button
															size='sm'
															variant='outline'
															onClick={() =>
																openPredictionDialog(
																	prediction.match!,
																	prediction
																)
															}>
															Edit
														</Button>
													)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Prediction Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>
							{selectedPrediction ? 'Edit Prediction' : 'Make Prediction'}
						</DialogTitle>
					</DialogHeader>
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
