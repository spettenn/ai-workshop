'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiService } from '@/lib/api';
import {
	User,
	AuthContextType,
	LoginRequest,
	RegisterRequest,
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Initialize auth state from localStorage
	useEffect(() => {
		const initAuth = async () => {
			try {
				const storedToken = localStorage.getItem('auth_token');
				const storedUser = localStorage.getItem('user');

				if (storedToken && storedUser) {
					setToken(storedToken);
					setUser(JSON.parse(storedUser));

					// Verify token is still valid
					try {
						const currentUser = await apiService.getCurrentUser();
						setUser(currentUser);
						localStorage.setItem('user', JSON.stringify(currentUser));
					} catch (error) {
						// Token is invalid, clear auth state
						localStorage.removeItem('auth_token');
						localStorage.removeItem('user');
						setToken(null);
						setUser(null);
					}
				}
			} catch (error) {
				console.error('Auth initialization error:', error);
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);

	const login = async (credentials: LoginRequest) => {
		try {
			setIsLoading(true);
			const response = await apiService.login(credentials);

			setUser(response.user);
			setToken(response.token);

			localStorage.setItem('auth_token', response.token);
			localStorage.setItem('user', JSON.stringify(response.user));

			toast.success(`Welcome back, ${response.user.name}!`);
		} catch (error: any) {
			const message = error.response?.data?.error || 'Login failed';
			toast.error(message);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (userData: RegisterRequest) => {
		try {
			setIsLoading(true);
			const response = await apiService.register(userData);

			setUser(response.user);
			setToken(response.token);

			localStorage.setItem('auth_token', response.token);
			localStorage.setItem('user', JSON.stringify(response.user));

			toast.success(`Welcome to the betting pool, ${response.user.name}!`);
		} catch (error: any) {
			const message = error.response?.data?.error || 'Registration failed';
			toast.error(message);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem('auth_token');
		localStorage.removeItem('user');
		toast.success('Logged out successfully');
	};

	const value: AuthContextType = {
		user,
		token,
		login,
		register,
		logout,
		isLoading,
		isAuthenticated: !!user && !!token,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
