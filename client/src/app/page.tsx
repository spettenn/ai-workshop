'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function HomePage() {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (user) {
				router.push('/dashboard');
			} else {
				router.push('/login');
			}
		}
	}, [user, isLoading, router]);

	// Show loading while determining auth state
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
			<div className='text-center'>
				<div className='text-6xl mb-4'>⚽</div>
				<h1 className='text-2xl font-bold text-gray-900 mb-2'>
					World Cup Betting Pool
				</h1>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
				<p className='mt-2 text-gray-600'>Loading...</p>
			</div>
		</div>
	);
}
