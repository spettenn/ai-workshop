'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			setIsLoading(true);
			await login(data);
			router.push('/dashboard');
		} catch (error) {
			// Error is handled by the auth context
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold text-center'>
						⚽ World Cup Betting
					</CardTitle>
					<CardDescription className='text-center'>
						Sign in to your account to start predicting match results
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='john.doe@company.com'
								{...register('email')}
								className={errors.email ? 'border-red-500' : ''}
							/>
							{errors.email && (
								<p className='text-sm text-red-500'>{errors.email.message}</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								placeholder='Enter your password'
								{...register('password')}
								className={errors.password ? 'border-red-500' : ''}
							/>
							{errors.password && (
								<p className='text-sm text-red-500'>
									{errors.password.message}
								</p>
							)}
						</div>

						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ? 'Signing in...' : 'Sign In'}
						</Button>
					</form>

					<div className='mt-6 text-center'>
						<p className='text-sm text-gray-600'>
							Don't have an account?{' '}
							<Link
								href='/register'
								className='font-medium text-blue-600 hover:text-blue-500'>
								Sign up here
							</Link>
						</p>
					</div>

					<div className='mt-4 p-3 bg-blue-50 rounded-lg'>
						<p className='text-xs text-blue-700 text-center'>
							<strong>Demo Accounts:</strong>
							<br />
							alice@company.com / password123
							<br />
							bob@company.com / password123
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
