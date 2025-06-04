'use client';

import { Leaderboard } from '@/components/Leaderboard';

export default function LeaderboardPage() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-2'>Leaderboard</h1>
				<p className='text-gray-600'>
					See how you rank against other players in the World Cup betting
					competition
				</p>
			</div>

			<Leaderboard showUserRank={true} />
		</div>
	);
}
