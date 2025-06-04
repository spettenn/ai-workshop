import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

/**
 * Generate a JWT token for a user
 */
export const generateToken = (userId: string, email: string): string => {
	const payload: JWTPayload = {
		userId,
		email,
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JWTPayload | null => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
		return decoded;
	} catch (error) {
		console.error('JWT verification failed:', error);
		return null;
	}
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (
	authHeader: string | undefined
): string | null => {
	if (!authHeader) {
		return null;
	}

	// Expected format: "Bearer <token>"
	const parts = authHeader.split(' ');
	if (parts.length !== 2 || parts[0] !== 'Bearer') {
		return null;
	}

	return parts[1];
};
