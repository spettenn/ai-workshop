'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';

export function Navigation() {
	const pathname = usePathname();
	const { user, logout } = useAuth();
	const { isConnected } = useSocket();

	// Don't show navigation on auth pages
	if (pathname === '/login' || pathname === '/register') {
		return null;
	}

	const navItems = [
		{ href: '/dashboard', label: 'Dashboard', icon: '🏠' },
		{ href: '/predictions', label: 'Predictions', icon: '⚽' },
		{ href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
		{ href: '/info', label: 'Info', icon: 'ℹ️' },
	];

	const isActive = (href: string) => {
		if (href === '/dashboard') {
			return pathname === '/' || pathname === '/dashboard';
		}
		return pathname === href;
	};

	return (
		<header className='bg-white shadow-sm border-b sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					{/* Logo and Title */}
					<div className='flex items-center space-x-4'>
						<Link href='/dashboard' className='flex items-center space-x-2'>
							<span className='text-2xl'>⚽</span>
							<h1 className='text-xl font-bold text-gray-900'>
								World Cup Betting Pool
							</h1>
						</Link>

						{/* Connection Status */}
						<div className='flex items-center space-x-2'>
							<div
								className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
							<span className='text-xs text-gray-500'>
								{isConnected ? 'Live' : 'Offline'}
							</span>
						</div>
					</div>

					{/* Navigation Links */}
					<nav className='hidden md:flex items-center space-x-1'>
						{navItems.map((item) => (
							<Link key={item.href} href={item.href}>
								<Button
									variant={isActive(item.href) ? 'default' : 'ghost'}
									size='sm'
									className='flex items-center space-x-2'>
									<span>{item.icon}</span>
									<span>{item.label}</span>
								</Button>
							</Link>
						))}
					</nav>

					{/* User Menu */}
					<div className='flex items-center space-x-4'>
						<div className='text-sm text-gray-600'>
							Welcome, <span className='font-medium'>{user?.name}</span>
							{user?.department && (
								<span className='text-gray-400'> • {user.department}</span>
							)}
						</div>
						<Button variant='outline' size='sm' onClick={logout}>
							Logout
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<div className='md:hidden border-t border-gray-200'>
					<nav className='flex items-center justify-around py-2'>
						{navItems.map((item) => (
							<Link key={item.href} href={item.href}>
								<Button
									variant={isActive(item.href) ? 'default' : 'ghost'}
									size='sm'
									className='flex flex-col items-center space-y-1 h-auto py-2'>
									<span className='text-lg'>{item.icon}</span>
									<span className='text-xs'>{item.label}</span>
								</Button>
							</Link>
						))}
					</nav>
				</div>
			</div>
		</header>
	);
}
