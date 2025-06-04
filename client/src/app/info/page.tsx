import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function InfoPage() {
	return (
		<div className='min-h-screen bg-background'>
			{/* Hero Section */}
			<div className='eltek-gradient border-b border-border'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
					<div className='text-center'>
						<div className='w-20 h-16 relative mx-auto mb-6'>
							<Image
								src='/eltek-logo.svg'
								alt='Eltek Holding'
								fill
								className='object-contain'
								priority
							/>
						</div>
						<h1 className='text-4xl lg:text-5xl font-bold text-foreground mb-6'>
							World Cup Betting Pool Guide
						</h1>
						<p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
							Everything you need to know about Eltek's internal betting pool
							for the FIFA World Cup 2026
						</p>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='space-y-8'>
					{/* Navigation Guide */}
					<Card className='card-hover border border-border'>
						<CardHeader>
							<CardTitle className='flex items-center space-x-3 text-2xl'>
								<span className='text-3xl'>🧭</span>
								<span>Navigation Guide</span>
							</CardTitle>
							<CardDescription className='text-lg'>
								Learn how to navigate through the different sections of the app
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid gap-6 md:grid-cols-2'>
								<div className='p-4 bg-muted/30 rounded-lg'>
									<div className='flex items-center space-x-3 mb-3'>
										<span className='text-2xl'>🏠</span>
										<span className='font-semibold text-lg'>Dashboard</span>
									</div>
									<p className='text-muted-foreground'>
										Your home base showing upcoming matches, recent activity,
										and quick stats
									</p>
								</div>
								<div className='p-4 bg-muted/30 rounded-lg'>
									<div className='flex items-center space-x-3 mb-3'>
										<span className='text-2xl'>⚽</span>
										<span className='font-semibold text-lg'>Predictions</span>
									</div>
									<p className='text-muted-foreground'>
										Make your match predictions and view your betting history
									</p>
								</div>
								<div className='p-4 bg-muted/30 rounded-lg'>
									<div className='flex items-center space-x-3 mb-3'>
										<span className='text-2xl'>🏆</span>
										<span className='font-semibold text-lg'>Leaderboard</span>
									</div>
									<p className='text-muted-foreground'>
										See how you rank against your colleagues and track top
										performers
									</p>
								</div>
								<div className='p-4 bg-muted/30 rounded-lg'>
									<div className='flex items-center space-x-3 mb-3'>
										<span className='text-2xl'>ℹ️</span>
										<span className='font-semibold text-lg'>Info</span>
									</div>
									<p className='text-muted-foreground'>
										This page - your guide to using the betting pool
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* How Betting Works */}
					<Card className='card-hover border border-border'>
						<CardHeader>
							<CardTitle className='flex items-center space-x-3 text-2xl'>
								<span className='text-3xl'>🎯</span>
								<span>How Betting Works</span>
							</CardTitle>
							<CardDescription className='text-lg'>
								Understanding the prediction system and how to make bets
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid gap-6 md:grid-cols-2'>
								<div className='space-y-4'>
									<h4 className='font-semibold text-lg text-foreground'>
										Making Predictions
									</h4>
									<ul className='space-y-2 text-muted-foreground'>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>
												Navigate to the <strong>Predictions</strong> page
											</span>
										</li>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>Find the match you want to bet on</span>
										</li>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>Enter your predicted score for both teams</span>
										</li>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>
												Submit your prediction before the match starts
											</span>
										</li>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>You can update predictions until kickoff time</span>
										</li>
									</ul>
								</div>
								<div className='space-y-4'>
									<h4 className='font-semibold text-lg text-foreground'>
										Match Status
									</h4>
									<div className='space-y-3'>
										<div className='flex items-center space-x-3'>
											<Badge variant='outline'>SCHEDULED</Badge>
											<span className='text-sm text-muted-foreground'>
												Predictions open
											</span>
										</div>
										<div className='flex items-center space-x-3'>
											<Badge className='bg-red-500 text-white'>LIVE</Badge>
											<span className='text-sm text-muted-foreground'>
												Predictions locked
											</span>
										</div>
										<div className='flex items-center space-x-3'>
											<Badge variant='secondary'>FINISHED</Badge>
											<span className='text-sm text-muted-foreground'>
												Points calculated
											</span>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Scoring System */}
					<Card className='card-hover border border-border'>
						<CardHeader>
							<CardTitle className='flex items-center space-x-3 text-2xl'>
								<span className='text-3xl'>📊</span>
								<span>Scoring System</span>
							</CardTitle>
							<CardDescription className='text-lg'>
								How points are calculated for your predictions
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-4'>
									<div className='p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800'>
										<div className='flex items-center justify-between mb-2'>
											<span className='font-semibold text-green-800 dark:text-green-200'>
												Exact Score
											</span>
											<Badge className='bg-green-600'>5 Points</Badge>
										</div>
										<p className='text-sm text-green-700 dark:text-green-300'>
											You predicted the exact final score
										</p>
									</div>
									<div className='p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800'>
										<div className='flex items-center justify-between mb-2'>
											<span className='font-semibold text-blue-800 dark:text-blue-200'>
												Correct Result
											</span>
											<Badge className='bg-blue-600'>3 Points</Badge>
										</div>
										<p className='text-sm text-blue-700 dark:text-blue-300'>
											You predicted the right winner (or draw)
										</p>
									</div>
								</div>
								<div className='space-y-4'>
									<div className='p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800'>
										<div className='flex items-center justify-between mb-2'>
											<span className='font-semibold text-yellow-800 dark:text-yellow-200'>
												One Team Correct
											</span>
											<Badge className='bg-yellow-600'>1 Point</Badge>
										</div>
										<p className='text-sm text-yellow-700 dark:text-yellow-300'>
											You got one team's score exactly right
										</p>
									</div>
									<div className='p-4 bg-muted rounded-lg border border-border'>
										<div className='flex items-center justify-between mb-2'>
											<span className='font-semibold text-foreground'>
												No Match
											</span>
											<Badge variant='outline'>0 Points</Badge>
										</div>
										<p className='text-sm text-muted-foreground'>
											Your prediction didn't match the result
										</p>
									</div>
								</div>
							</div>

							<div className='p-6 bg-primary/5 border border-primary/20 rounded-lg'>
								<h4 className='font-semibold text-primary mb-4 text-lg'>
									Examples:
								</h4>
								<div className='space-y-3 text-sm'>
									<div className='flex justify-between items-center p-2 bg-background rounded border'>
										<span>
											Actual: Brazil 2-1 Argentina, Predicted: Brazil 2-1
											Argentina
										</span>
										<Badge className='bg-green-600'>5 Points</Badge>
									</div>
									<div className='flex justify-between items-center p-2 bg-background rounded border'>
										<span>
											Actual: Brazil 2-1 Argentina, Predicted: Brazil 1-0
											Argentina
										</span>
										<Badge className='bg-blue-600'>3 Points</Badge>
									</div>
									<div className='flex justify-between items-center p-2 bg-background rounded border'>
										<span>
											Actual: Brazil 2-1 Argentina, Predicted: Brazil 2-0
											Argentina
										</span>
										<Badge className='bg-yellow-600'>1 Point</Badge>
									</div>
									<div className='flex justify-between items-center p-2 bg-background rounded border'>
										<span>
											Actual: Brazil 2-1 Argentina, Predicted: Argentina 1-0
											Brazil
										</span>
										<Badge variant='outline'>0 Points</Badge>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Tips for Success */}
					<Card className='card-hover border border-border'>
						<CardHeader>
							<CardTitle className='flex items-center space-x-3 text-2xl'>
								<span className='text-3xl'>💡</span>
								<span>Tips for Success</span>
							</CardTitle>
							<CardDescription className='text-lg'>
								Strategies to improve your predictions and climb the leaderboard
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid gap-6 md:grid-cols-2'>
								<div className='space-y-4'>
									<h4 className='font-semibold text-lg text-foreground'>
										Research & Strategy
									</h4>
									<ul className='space-y-2 text-muted-foreground'>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>Check team form and recent results</span>
										</li>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>Consider head-to-head records</span>
										</li>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>Factor in player injuries and suspensions</span>
										</li>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>Think about tournament pressure and stakes</span>
										</li>
									</ul>
								</div>
								<div className='space-y-4'>
									<h4 className='font-semibold text-lg text-foreground'>
										Prediction Tips
									</h4>
									<ul className='space-y-2 text-muted-foreground'>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>Don't always go for high-scoring games</span>
										</li>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>Consider defensive teams and low scores</span>
										</li>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>Update predictions as new information emerges</span>
										</li>
										<li className='flex items-start space-x-2'>
											<span className='text-primary mt-1'>•</span>
											<span>Trust your instincts but stay realistic</span>
										</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Company Information */}
					<Card className='card-hover border border-border bg-muted/30'>
						<CardHeader>
							<CardTitle className='flex items-center space-x-3 text-2xl'>
								<div className='w-8 h-6 relative'>
									<Image
										src='/eltek-logo.svg'
										alt='Eltek Holding'
										fill
										className='object-contain'
									/>
								</div>
								<span>About This Application</span>
							</CardTitle>
							<CardDescription className='text-lg'>
								An internal application by Eltek Holding
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<p className='text-muted-foreground'>
								This World Cup betting pool is an internal application developed
								for Eltek Holding employees to engage with the FIFA World Cup
								2026 in a fun and competitive way. As owners, we add
								complementary strengths and are actively engaged to make a
								difference - even in our internal applications.
							</p>
							<div className='flex items-center space-x-4 pt-4'>
								<div className='flex items-center space-x-2'>
									<div className='w-6 h-5 relative'>
										<Image
											src='/eltek-logo.svg'
											alt='Eltek Holding'
											fill
											className='object-contain'
										/>
									</div>
									<span className='font-semibold text-foreground'>
										Eltek Holding
									</span>
								</div>
								<span className='text-muted-foreground'>•</span>
								<span className='text-sm text-muted-foreground'>
									Internal Use Only
								</span>
							</div>
						</CardContent>
					</Card>

					{/* Call to Action */}
					<div className='text-center py-8'>
						<h3 className='text-2xl font-semibold text-foreground mb-4'>
							Ready to Start Predicting?
						</h3>
						<p className='text-muted-foreground mb-6'>
							Join your colleagues in the competition and see who can predict
							the World Cup best!
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Link href='/predictions'>
								<Button size='lg' className='btn-animate'>
									Make Predictions
								</Button>
							</Link>
							<Link href='/leaderboard'>
								<Button variant='outline' size='lg' className='btn-animate'>
									View Leaderboard
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
