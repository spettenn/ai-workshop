'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (user) {
				router.push('/dashboard');
			}
		}
	}, [user, isLoading, router]);

	// Show hero page for non-authenticated users
	if (!user && !isLoading) {
		return (
			<div className='min-h-screen hero-section'>
				<div className='relative z-10'>
					{/* Hero Section */}
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16'>
						<div className='text-center'>
							{/* Logo */}
							<div className='flex justify-center mb-8'>
								<div className='w-24 h-20 relative'>
									<Image
										src='/eltek-logo.svg'
										alt='Eltek Holding'
										fill
										className='object-contain'
										priority
									/>
								</div>
							</div>

							{/* Main Heading */}
							<h1 className='text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight'>
								World Cup Betting Pool
							</h1>

							{/* Subheading */}
							<p className='text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed'>
								Join Eltek's internal betting pool for the FIFA World Cup 2026.
								Predict match outcomes, compete with colleagues, and climb the
								leaderboard.
							</p>

							{/* CTA Buttons */}
							<div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
								<Link href='/login'>
									<Button size='lg' className='btn-animate text-lg px-8 py-3'>
										Sign In
									</Button>
								</Link>
								<Link href='/register'>
									<Button
										variant='outline'
										size='lg'
										className='btn-animate text-lg px-8 py-3'>
										Create Account
									</Button>
								</Link>
							</div>
						</div>
					</div>

					{/* Features Section */}
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20'>
						<div className='grid md:grid-cols-3 gap-8'>
							<div className='text-center p-6 bg-card rounded-xl shadow-sm card-hover border border-border'>
								<div className='text-4xl mb-4'>⚽</div>
								<h3 className='text-xl font-semibold mb-3'>
									Match Predictions
								</h3>
								<p className='text-muted-foreground'>
									Predict match outcomes and scores for all World Cup games.
									Earn points based on accuracy.
								</p>
							</div>

							<div className='text-center p-6 bg-card rounded-xl shadow-sm card-hover border border-border'>
								<div className='text-4xl mb-4'>🏆</div>
								<h3 className='text-xl font-semibold mb-3'>Live Leaderboard</h3>
								<p className='text-muted-foreground'>
									Track your ranking against colleagues in real-time. See who's
									leading the competition.
								</p>
							</div>

							<div className='text-center p-6 bg-card rounded-xl shadow-sm card-hover border border-border'>
								<div className='text-4xl mb-4'>📊</div>
								<h3 className='text-xl font-semibold mb-3'>
									Real-time Updates
								</h3>
								<p className='text-muted-foreground'>
									Get instant updates on match results and leaderboard changes.
									Stay connected throughout the tournament.
								</p>
							</div>
						</div>
					</div>

					{/* Company Branding */}
					<div className='border-t border-border bg-muted/30'>
						<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
							<div className='text-center'>
								<p className='text-muted-foreground mb-4'>
									An internal application by
								</p>
								<div className='flex items-center justify-center space-x-3'>
									<div className='w-8 h-6 relative'>
										<Image
											src='/eltek-logo.svg'
											alt='Eltek Holding'
											fill
											className='object-contain'
										/>
									</div>
									<span className='text-2xl font-semibold text-foreground'>
										Eltek Holding
									</span>
								</div>
								<p className='text-sm text-muted-foreground mt-2'>
									As owners, we add complementary strengths and are actively
									engaged to make a difference.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Show loading while determining auth state
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
					Eltek World Cup Betting Pool
				</h1>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
				<p className='mt-4 text-muted-foreground'>Loading...</p>
			</div>
		</div>
	);
}
