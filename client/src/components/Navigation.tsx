'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
		<header className='nav-blur sticky top-0 z-50 border-b border-border/40'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					{/* Logo and Title */}
					<div className='flex items-center space-x-6'>
						<Link
							href='/dashboard'
							className='flex items-center space-x-3 group'>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-8 relative group-hover:scale-110 transition-transform'>
									<Image
										src='/eltek-logo.svg'
										alt='Eltek Holding'
										fill
										className='object-contain'
										priority
									/>
								</div>
								<div className='flex flex-col'>
									<span className='text-lg font-semibold text-foreground leading-none'>
										Eltek
									</span>
									<span className='text-xs text-muted-foreground leading-none'>
										World Cup Pool
									</span>
								</div>
							</div>
						</Link>

						{/* Connection Status */}
						<div className='hidden sm:flex items-center space-x-2'>
							<div
								className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
							<span className='text-xs text-muted-foreground'>
								{isConnected ? 'Live' : 'Offline'}
							</span>
						</div>
					</div>

					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center space-x-1'>
						{/* Dashboard Link */}
						<Link href='/dashboard'>
							<Button
								variant={isActive('/dashboard') ? 'default' : 'ghost'}
								size='sm'
								className='btn-animate'>
								Dashboard
							</Button>
						</Link>

						{/* Direct Navigation Links */}
						{navItems.map((item) => (
							<Link key={item.href} href={item.href}>
								<Button
									variant={isActive(item.href) ? 'default' : 'ghost'}
									size='sm'
									className='btn-animate'>
									{item.label}
								</Button>
							</Link>
						))}

						{/* User Menu */}
						<div className='flex items-center space-x-3 ml-4 pl-4 border-l border-border'>
							<div className='text-sm'>
								<span className='font-medium text-foreground'>
									{user?.name}
								</span>
							</div>
							<Button
								variant='outline'
								size='sm'
								onClick={logout}
								className='btn-animate'>
								Logout
							</Button>
						</div>
					</div>

					{/* Mobile Navigation */}
					<div className='md:hidden flex items-center space-x-2'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									size='sm'
									className='flex items-center space-x-1'>
									<span>Menu</span>
									<span className='text-xs'>▼</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-48'>
								<DropdownMenuItem asChild>
									<Link
										href='/dashboard'
										className='flex items-center space-x-2 w-full'>
										<span>🏠</span>
										<span>Dashboard</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								{navItems.map((item) => (
									<DropdownMenuItem key={item.href} asChild>
										<Link
											href={item.href}
											className='flex items-center space-x-2 w-full'>
											<span>{item.icon}</span>
											<span>{item.label}</span>
										</Link>
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={logout} className='text-destructive'>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<div className='text-xs text-muted-foreground'>{user?.name}</div>
					</div>
				</div>
			</div>
		</header>
	);
}
