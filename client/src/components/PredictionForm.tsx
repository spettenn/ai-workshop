'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Match } from '@/types/match';
import {
	Prediction,
	getPredictionStatus,
	getTimeUntilKickoff,
	SCORING_RULES,
} from '@/types/prediction';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

interface PredictionFormProps {
	match: Match;
	existingPrediction?: Prediction;
	onSuccess?: () => void;
	onCancel?: () => void;
}

const predictionSchema = z.object({
	homeGoals: z
		.number()
		.min(0, 'Goals must be 0 or greater')
		.max(20, 'Goals must be 20 or less'),
	awayGoals: z
		.number()
		.min(0, 'Goals must be 0 or greater')
		.max(20, 'Goals must be 20 or less'),
});

type PredictionFormData = z.infer<typeof predictionSchema>;

export function PredictionForm({
	match,
	existingPrediction,
	onSuccess,
	onCancel,
}: PredictionFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [timeLeft, setTimeLeft] = useState(
		getTimeUntilKickoff(match.kickoffTime)
	);
	const predictionStatus = getPredictionStatus(match.kickoffTime);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<PredictionFormData>({
		resolver: zodResolver(predictionSchema),
		defaultValues: {
			homeGoals: existingPrediction?.homeGoals || 0,
			awayGoals: existingPrediction?.awayGoals || 0,
		},
	});

	// Update countdown timer
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(getTimeUntilKickoff(match.kickoffTime));
		}, 1000);

		return () => clearInterval(interval);
	}, [match.kickoffTime]);

	const onSubmit = async (data: PredictionFormData) => {
		if (predictionStatus === 'locked') {
			toast.error('Cannot submit prediction after match has started');
			return;
		}

		try {
			setIsLoading(true);

			if (existingPrediction) {
				// Update existing prediction
				await apiService.updatePrediction(existingPrediction.id, data);
				toast.success('Prediction updated successfully!');
			} else {
				// Create new prediction
				await apiService.createPrediction({
					matchId: match.id,
					...data,
				});
				toast.success('Prediction submitted successfully!');
			}

			onSuccess?.();
		} catch (error: any) {
			const message =
				error.response?.data?.error || 'Failed to submit prediction';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!existingPrediction) return;

		if (predictionStatus === 'locked') {
			toast.error('Cannot delete prediction after match has started');
			return;
		}

		try {
			setIsLoading(true);
			await apiService.deletePrediction(existingPrediction.id);
			toast.success('Prediction deleted successfully!');
			onSuccess?.();
		} catch (error: any) {
			const message =
				error.response?.data?.error || 'Failed to delete prediction';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	const formatTimeLeft = () => {
		if (timeLeft.isExpired) {
			return 'Match has started';
		}

		const parts = [];
		if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
		if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
		if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}m`);
		if (timeLeft.seconds > 0 && timeLeft.days === 0)
			parts.push(`${timeLeft.seconds}s`);

		return parts.join(' ') || '0s';
	};

	const isLocked = predictionStatus === 'locked';

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle className='text-lg'>
					{existingPrediction ? 'Update Prediction' : 'Make Prediction'}
				</CardTitle>
				<CardDescription>
					{match.homeTeam} vs {match.awayTeam}
				</CardDescription>

				{/* Countdown Timer */}
				<div className='flex items-center justify-between pt-2'>
					<Badge variant={isLocked ? 'destructive' : 'default'}>
						{isLocked ? '🔒 Locked' : '⏰ ' + formatTimeLeft()}
					</Badge>
					{match.round && (
						<span className='text-xs text-gray-500'>{match.round}</span>
					)}
				</div>
			</CardHeader>

			<CardContent className='space-y-4'>
				{/* Scoring Rules */}
				<div className='p-3 bg-blue-50 rounded-lg'>
					<h4 className='text-sm font-medium mb-2'>Scoring Rules:</h4>
					<div className='text-xs space-y-1'>
						<div>🎯 Exact score: {SCORING_RULES.EXACT_SCORE} points</div>
						<div>
							🎲 Correct winner + goal difference:{' '}
							{SCORING_RULES.CORRECT_WINNER_AND_DIFFERENCE} points
						</div>
						<div>
							✅ Correct winner only: {SCORING_RULES.CORRECT_WINNER_ONLY} point
						</div>
					</div>
				</div>

				{isLocked ? (
					<div className='text-center py-4'>
						<div className='text-gray-500 mb-2'>Predictions are locked</div>
						{existingPrediction && (
							<div className='p-3 bg-gray-50 rounded-lg'>
								<div className='text-sm font-medium'>Your Prediction:</div>
								<div className='text-lg'>
									{match.homeTeam} {existingPrediction.homeGoals} -{' '}
									{existingPrediction.awayGoals} {match.awayTeam}
								</div>
								{existingPrediction.points > 0 && (
									<Badge className='mt-2'>
										{existingPrediction.points} points earned
									</Badge>
								)}
							</div>
						)}
					</div>
				) : (
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						{/* Score Inputs */}
						<div className='grid grid-cols-3 gap-4 items-center'>
							<div className='text-center'>
								<Label htmlFor='homeGoals' className='text-sm font-medium'>
									{match.homeTeam}
								</Label>
								<Input
									id='homeGoals'
									type='number'
									min='0'
									max='20'
									{...register('homeGoals', { valueAsNumber: true })}
									className={`text-center text-lg ${errors.homeGoals ? 'border-red-500' : ''}`}
								/>
								{errors.homeGoals && (
									<p className='text-xs text-red-500 mt-1'>
										{errors.homeGoals.message}
									</p>
								)}
							</div>

							<div className='text-center text-lg font-bold text-gray-500'>
								VS
							</div>

							<div className='text-center'>
								<Label htmlFor='awayGoals' className='text-sm font-medium'>
									{match.awayTeam}
								</Label>
								<Input
									id='awayGoals'
									type='number'
									min='0'
									max='20'
									{...register('awayGoals', { valueAsNumber: true })}
									className={`text-center text-lg ${errors.awayGoals ? 'border-red-500' : ''}`}
								/>
								{errors.awayGoals && (
									<p className='text-xs text-red-500 mt-1'>
										{errors.awayGoals.message}
									</p>
								)}
							</div>
						</div>

						{/* Action Buttons */}
						<div className='flex space-x-2'>
							<Button type='submit' className='flex-1' disabled={isLoading}>
								{isLoading
									? 'Submitting...'
									: existingPrediction
										? 'Update Prediction'
										: 'Submit Prediction'}
							</Button>

							{existingPrediction && (
								<Button
									type='button'
									variant='destructive'
									onClick={handleDelete}
									disabled={isLoading}>
									Delete
								</Button>
							)}

							{onCancel && (
								<Button
									type='button'
									variant='outline'
									onClick={onCancel}
									disabled={isLoading}>
									Cancel
								</Button>
							)}
						</div>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
