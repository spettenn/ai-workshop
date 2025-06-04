export interface RegisterRequest {
	email: string;
	name: string;
	department?: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	user: {
		id: string;
		email: string;
		name: string;
		department?: string;
	};
	token: string;
}

export interface JWTPayload {
	userId: string;
	email: string;
	iat?: number;
	exp?: number;
}

export interface AuthenticatedRequest extends Request {
	user?: {
		userId: string;
		email: string;
	};
}
