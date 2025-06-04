import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const registerSchema = z.object({
	email: z.string().email('Invalid email format'),
	name: z.string().min(2, 'Name must be at least 2 characters'),
	department: z.string().optional(),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
	try {
		// Validate request body
		const validatedData = registerSchema.parse(req.body);
		const { email, name, department, password } = validatedData;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			res.status(400).json({
				error: 'User with this email already exists',
			});
			return;
		}

		// Hash password
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create user
		const user = await prisma.user.create({
			data: {
				email,
				name,
				department,
				password: hashedPassword,
			},
		});

		// Generate JWT token
		const token = generateToken(user.id, user.email);

		// Return user data (without password) and token
		const response: AuthResponse = {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				department: user.department || undefined,
			},
			token,
		};

		res.status(201).json(response);
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json({
				error: 'Validation failed',
				details: error.errors,
			});
			return;
		}

		console.error('Registration error:', error);
		res.status(500).json({
			error: 'Internal server error',
		});
	}
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
	try {
		// Validate request body
		const validatedData = loginSchema.parse(req.body);
		const { email, password } = validatedData;

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			res.status(401).json({
				error: 'Invalid email or password',
			});
			return;
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			res.status(401).json({
				error: 'Invalid email or password',
			});
			return;
		}

		// Generate JWT token
		const token = generateToken(user.id, user.email);

		// Return user data (without password) and token
		const response: AuthResponse = {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				department: user.department || undefined,
			},
			token,
		};

		res.json(response);
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json({
				error: 'Validation failed',
				details: error.errors,
			});
			return;
		}

		console.error('Login error:', error);
		res.status(500).json({
			error: 'Internal server error',
		});
	}
});

/**
 * GET /api/auth/me
 * Get current user profile (protected route)
 */
router.get(
	'/me',
	authenticateToken,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({
					error: 'User not authenticated',
				});
				return;
			}

			// Get user from database
			const user = await prisma.user.findUnique({
				where: { id: req.user.userId },
				select: {
					id: true,
					email: true,
					name: true,
					department: true,
					createdAt: true,
				},
			});

			if (!user) {
				res.status(404).json({
					error: 'User not found',
				});
				return;
			}

			res.json({ user });
		} catch (error) {
			console.error('Get profile error:', error);
			res.status(500).json({
				error: 'Internal server error',
			});
		}
	}
);

export default router;
