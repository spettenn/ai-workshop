export interface User {
	id: string;
	email: string;
	name: string;
	department?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	user: User;
	token: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
	department?: string;
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (credentials: LoginRequest) => Promise<void>;
	register: (userData: RegisterRequest) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
	isAuthenticated: boolean;
}
