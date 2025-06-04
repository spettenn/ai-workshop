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

const registerSchema = z
	.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.string().email('Please enter a valid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string(),
		department: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const [isLoading, setIsLoading] = useState(false);
	const { register: registerUser } = useAuth();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterFormData) => {
		try {
			setIsLoading(true);
			await registerUser({
				name: data.name,
				email: data.email,
				password: data.password,
				department: data.department,
			});
			router.push('/dashboard');
		} catch (error) {
			// Error is handled by the auth context
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold text-center'>
						🏆 Join the Pool
					</CardTitle>
					<CardDescription className='text-center'>
						Create your account to start predicting World Cup matches
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='name'>Full Name</Label>
							<Input
								id='name'
								type='text'
								placeholder='John Doe'
								{...register('name')}
								className={errors.name ? 'border-red-500' : ''}
							/>
							{errors.name && (
								<p className='text-sm text-red-500'>{errors.name.message}</p>
							)}
						</div>

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
							<Label htmlFor='department'>Department (Optional)</Label>
							<Input
								id='department'
								type='text'
								placeholder='Engineering, Marketing, etc.'
								{...register('department')}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								placeholder='Create a password'
								{...register('password')}
								className={errors.password ? 'border-red-500' : ''}
							/>
							{errors.password && (
								<p className='text-sm text-red-500'>
									{errors.password.message}
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='confirmPassword'>Confirm Password</Label>
							<Input
								id='confirmPassword'
								type='password'
								placeholder='Confirm your password'
								{...register('confirmPassword')}
								className={errors.confirmPassword ? 'border-red-500' : ''}
							/>
							{errors.confirmPassword && (
								<p className='text-sm text-red-500'>
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ? 'Creating Account...' : 'Create Account'}
						</Button>
					</form>

					<div className='mt-6 text-center'>
						<p className='text-sm text-gray-600'>
							Already have an account?{' '}
							<Link
								href='/login'
								className='font-medium text-green-600 hover:text-green-500'>
								Sign in here
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
