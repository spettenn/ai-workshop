import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
	user?: {
		userId: string;
		email: string;
	};
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): void => {
	const token = extractTokenFromHeader(req.headers.authorization);

	if (!token) {
		res.status(401).json({
			error: 'Access denied. No token provided.',
		});
		return;
	}

	const decoded = verifyToken(token);

	if (!decoded) {
		res.status(401).json({
			error: 'Access denied. Invalid token.',
		});
		return;
	}

	// Add user info to request object
	req.user = {
		userId: decoded.userId,
		email: decoded.email,
	};

	next();
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): void => {
	const token = extractTokenFromHeader(req.headers.authorization);

	if (token) {
		const decoded = verifyToken(token);
		if (decoded) {
			req.user = {
				userId: decoded.userId,
				email: decoded.email,
			};
		}
	}

	next();
};
