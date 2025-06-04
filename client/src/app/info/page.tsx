import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InfoPage() {
	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-2'>
					How to Use the World Cup Betting Pool
				</h1>
				<p className='text-lg text-gray-600'>
					Everything you need to know about navigating the app and making
					predictions
				</p>
			</div>

			<div className='space-y-6'>
				{/* Navigation Guide */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2'>
							<span>🧭</span>
							<span>Navigation Guide</span>
						</CardTitle>
						<CardDescription>
							Learn how to navigate through the different sections of the app
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid gap-4 md:grid-cols-2'>
							<div className='space-y-2'>
								<div className='flex items-center space-x-2'>
									<span className='text-xl'>🏠</span>
									<span className='font-semibold'>Dashboard</span>
								</div>
								<p className='text-sm text-gray-600 ml-6'>
									Your home base showing upcoming matches, recent activity, and
									quick stats
								</p>
							</div>
							<div className='space-y-2'>
								<div className='flex items-center space-x-2'>
									<span className='text-xl'>⚽</span>
									<span className='font-semibold'>Predictions</span>
								</div>
								<p className='text-sm text-gray-600 ml-6'>
									Make your match predictions and view your betting history
								</p>
							</div>
							<div className='space-y-2'>
								<div className='flex items-center space-x-2'>
									<span className='text-xl'>🏆</span>
									<span className='font-semibold'>Leaderboard</span>
								</div>
								<p className='text-sm text-gray-600 ml-6'>
									See how you rank against your colleagues and track top
									performers
								</p>
							</div>
							<div className='space-y-2'>
								<div className='flex items-center space-x-2'>
									<span className='text-xl'>ℹ️</span>
									<span className='font-semibold'>Info</span>
								</div>
								<p className='text-sm text-gray-600 ml-6'>
									This page - your guide to using the betting pool
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* How Betting Works */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2'>
							<span>🎯</span>
							<span>How Betting Works</span>
						</CardTitle>
						<CardDescription>
							Understanding the prediction system and how to make bets
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='space-y-4'>
							<div>
								<h4 className='font-semibold mb-2'>Making Predictions</h4>
								<ul className='space-y-1 text-sm text-gray-600 ml-4'>
									<li>
										• Navigate to the <strong>Predictions</strong> page
									</li>
									<li>• Find the match you want to bet on</li>
									<li>• Enter your predicted score for both teams</li>
									<li>• Submit your prediction before the match starts</li>
									<li>• You can update predictions until kickoff time</li>
								</ul>
							</div>
							<div>
								<h4 className='font-semibold mb-2'>Match Status</h4>
								<div className='flex flex-wrap gap-2 mb-2'>
									<Badge variant='secondary'>SCHEDULED</Badge>
									<Badge variant='default'>LIVE</Badge>
									<Badge variant='outline'>FINISHED</Badge>
								</div>
								<ul className='space-y-1 text-sm text-gray-600 ml-4'>
									<li>
										• <strong>Scheduled:</strong> Match hasn't started yet - you
										can still make predictions
									</li>
									<li>
										• <strong>Live:</strong> Match is currently being played -
										predictions are locked
									</li>
									<li>
										• <strong>Finished:</strong> Match is over - points have
										been calculated
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Scoring System */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2'>
							<span>📊</span>
							<span>Scoring System</span>
						</CardTitle>
						<CardDescription>
							How points are calculated for your predictions
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid gap-4 md:grid-cols-2'>
							<div className='space-y-3'>
								<div className='p-3 bg-green-50 rounded-lg border border-green-200'>
									<div className='flex items-center justify-between mb-1'>
										<span className='font-semibold text-green-800'>
											Exact Score
										</span>
										<Badge className='bg-green-600'>5 Points</Badge>
									</div>
									<p className='text-sm text-green-700'>
										You predicted the exact final score
									</p>
								</div>
								<div className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
									<div className='flex items-center justify-between mb-1'>
										<span className='font-semibold text-blue-800'>
											Correct Result
										</span>
										<Badge className='bg-blue-600'>3 Points</Badge>
									</div>
									<p className='text-sm text-blue-700'>
										You predicted the right winner (or draw)
									</p>
								</div>
							</div>
							<div className='space-y-3'>
								<div className='p-3 bg-yellow-50 rounded-lg border border-yellow-200'>
									<div className='flex items-center justify-between mb-1'>
										<span className='font-semibold text-yellow-800'>
											One Team Correct
										</span>
										<Badge className='bg-yellow-600'>1 Point</Badge>
									</div>
									<p className='text-sm text-yellow-700'>
										You got one team's score exactly right
									</p>
								</div>
								<div className='p-3 bg-gray-50 rounded-lg border border-gray-200'>
									<div className='flex items-center justify-between mb-1'>
										<span className='font-semibold text-gray-800'>
											No Match
										</span>
										<Badge variant='outline'>0 Points</Badge>
									</div>
									<p className='text-sm text-gray-700'>
										Your prediction didn't match the result
									</p>
								</div>
							</div>
						</div>

						<div className='mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
							<h4 className='font-semibold text-blue-800 mb-2'>Examples:</h4>
							<div className='space-y-2 text-sm'>
								<div className='flex justify-between'>
									<span>
										Actual: Brazil 2-1 Argentina, Predicted: Brazil 2-1
										Argentina
									</span>
									<Badge className='bg-green-600'>5 pts</Badge>
								</div>
								<div className='flex justify-between'>
									<span>
										Actual: Brazil 3-1 Argentina, Predicted: Brazil 2-0
										Argentina
									</span>
									<Badge className='bg-blue-600'>3 pts</Badge>
								</div>
								<div className='flex justify-between'>
									<span>
										Actual: Brazil 2-1 Argentina, Predicted: Brazil 2-0
										Argentina
									</span>
									<Badge className='bg-yellow-600'>1 pt</Badge>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Real-time Features */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2'>
							<span>⚡</span>
							<span>Real-time Features</span>
						</CardTitle>
						<CardDescription>
							Stay updated with live match information and leaderboard changes
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='space-y-3'>
							<div className='flex items-start space-x-3'>
								<div className='w-2 h-2 bg-green-500 rounded-full mt-2'></div>
								<div>
									<h4 className='font-semibold'>Live Connection Status</h4>
									<p className='text-sm text-gray-600'>
										The green dot in the header shows you're connected to live
										updates
									</p>
								</div>
							</div>
							<div className='flex items-start space-x-3'>
								<span className='text-xl'>🔄</span>
								<div>
									<h4 className='font-semibold'>Live Match Updates</h4>
									<p className='text-sm text-gray-600'>
										Match scores and status update automatically without
										refreshing the page
									</p>
								</div>
							</div>
							<div className='flex items-start space-x-3'>
								<span className='text-xl'>🏆</span>
								<div>
									<h4 className='font-semibold'>Dynamic Leaderboard</h4>
									<p className='text-sm text-gray-600'>
										Your ranking updates in real-time as matches finish and
										points are calculated
									</p>
								</div>
							</div>
							<div className='flex items-start space-x-3'>
								<span className='text-xl'>🔔</span>
								<div>
									<h4 className='font-semibold'>Notifications</h4>
									<p className='text-sm text-gray-600'>
										Get notified when matches start, finish, or when your
										predictions earn points
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Tips and Best Practices */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2'>
							<span>💡</span>
							<span>Tips & Best Practices</span>
						</CardTitle>
						<CardDescription>
							Make the most of your betting experience
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid gap-4 md:grid-cols-2'>
							<div className='space-y-2'>
								<h4 className='font-semibold text-green-700'>Do's</h4>
								<ul className='space-y-1 text-sm text-gray-600'>
									<li>
										✅ Submit predictions early to avoid missing deadlines
									</li>
									<li>✅ Check the dashboard regularly for upcoming matches</li>
									<li>✅ Review your prediction history to improve strategy</li>
									<li>✅ Keep an eye on the leaderboard for motivation</li>
									<li>✅ Consider team form and recent performances</li>
								</ul>
							</div>
							<div className='space-y-2'>
								<h4 className='font-semibold text-red-700'>Don'ts</h4>
								<ul className='space-y-1 text-sm text-gray-600'>
									<li>❌ Don't wait until the last minute to predict</li>
									<li>❌ Don't forget to check match kickoff times</li>
									<li>❌ Don't make predictions based on bias alone</li>
									<li>❌ Don't ignore the connection status indicator</li>
									<li>❌ Don't forget this is just for fun!</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Support */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2'>
							<span>🆘</span>
							<span>Need Help?</span>
						</CardTitle>
						<CardDescription>Having trouble or found a bug?</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-3'>
							<p className='text-sm text-gray-600'>
								This is an internal company betting pool built during our AI
								workshop. If you encounter any issues or have suggestions for
								improvements:
							</p>
							<ul className='space-y-1 text-sm text-gray-600 ml-4'>
								<li>• Check that you're connected to the company network</li>
								<li>• Try refreshing the page if something seems stuck</li>
								<li>• Contact the development team if problems persist</li>
								<li>• Remember: this is a fun, friendly competition!</li>
							</ul>
							<div className='mt-4 p-3 bg-gray-50 rounded-lg'>
								<p className='text-sm text-gray-600 text-center italic'>
									Built with ❤️ during AI Workshop 2024
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
