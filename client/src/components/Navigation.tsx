'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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

					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center space-x-4'>
						{/* Dashboard Link */}
						<Link href='/dashboard'>
							<Button
								variant={isActive('/dashboard') ? 'default' : 'ghost'}
								size='sm'
								className='flex items-center space-x-2'>
								<span>🏠</span>
								<span>Dashboard</span>
							</Button>
						</Link>

						{/* Navigation Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									size='sm'
									className='flex items-center space-x-2'>
									<span>📋</span>
									<span>Menu</span>
									<span className='text-xs'>▼</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-48'>
								{navItems.map((item) => (
									<DropdownMenuItem key={item.href} asChild>
										<Link
											href={item.href}
											className={`flex items-center space-x-2 w-full ${
												isActive(item.href) ? 'bg-gray-100' : ''
											}`}>
											<span>{item.icon}</span>
											<span>{item.label}</span>
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* User Menu */}
						<div className='flex items-center space-x-3'>
							<div className='text-sm text-gray-700'>
								<span className='font-medium'>{user?.name}</span>
							</div>
							<Button variant='outline' size='sm' onClick={logout}>
								Logout
							</Button>
						</div>
					</div>

					{/* Mobile User Menu */}
					<div className='md:hidden flex items-center space-x-2'>
						<div className='text-sm text-gray-700'>
							<span className='font-medium text-xs'>{user?.name}</span>
						</div>
						<Button variant='outline' size='sm' onClick={logout}>
							Logout
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<div className='md:hidden border-t border-gray-200'>
					<nav className='flex items-center justify-around py-2'>
						<Link href='/dashboard'>
							<Button
								variant={isActive('/dashboard') ? 'default' : 'ghost'}
								size='sm'
								className='flex flex-col items-center space-y-1 h-auto py-2'>
								<span className='text-lg'>🏠</span>
								<span className='text-xs'>Dashboard</span>
							</Button>
						</Link>
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
