import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	User,
} from '@/types/auth';
import { Match, MatchListResponse, MatchFilters } from '@/types/match';
import {
	Prediction,
	CreatePredictionRequest,
	UpdatePredictionRequest,
	PredictionListResponse,
	PredictionFilters,
	LeaderboardResponse,
} from '@/types/prediction';

class ApiService {
	private api: AxiosInstance;

	constructor() {
		this.api = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		// Add request interceptor to include auth token
		this.api.interceptors.request.use((config) => {
			const token = localStorage.getItem('auth_token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		// Add response interceptor for error handling
		this.api.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					// Clear invalid token
					localStorage.removeItem('auth_token');
					localStorage.removeItem('user');
					window.location.href = '/login';
				}
				return Promise.reject(error);
			}
		);
	}

	// Auth endpoints
	async login(credentials: LoginRequest): Promise<AuthResponse> {
		const response: AxiosResponse<AuthResponse> = await this.api.post(
			'/api/auth/login',
			credentials
		);
		return response.data;
	}

	async register(userData: RegisterRequest): Promise<AuthResponse> {
		const response: AxiosResponse<AuthResponse> = await this.api.post(
			'/api/auth/register',
			userData
		);
		return response.data;
	}

	async getCurrentUser(): Promise<User> {
		const response: AxiosResponse<User> = await this.api.get('/api/auth/me');
		return response.data;
	}

	// Match endpoints
	async getMatches(filters?: MatchFilters): Promise<MatchListResponse> {
		const params = new URLSearchParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.append(key, value.toString());
				}
			});
		}

		const response: AxiosResponse<MatchListResponse> = await this.api.get(
			`/api/matches?${params.toString()}`
		);
		return response.data;
	}

	async getMockMatches(filters?: MatchFilters): Promise<MatchListResponse> {
		const params = new URLSearchParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.append(key, value.toString());
				}
			});
		}

		const response: AxiosResponse<MatchListResponse> = await this.api.get(
			`/api/matches/mock?${params.toString()}`
		);
		return response.data;
	}

	async getMatch(id: string): Promise<Match> {
		const response: AxiosResponse<Match> = await this.api.get(
			`/api/matches/${id}`
		);
		return response.data;
	}

	// Prediction endpoints
	async getPredictions(
		filters?: PredictionFilters
	): Promise<PredictionListResponse> {
		const params = new URLSearchParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.append(key, value.toString());
				}
			});
		}

		const response: AxiosResponse<PredictionListResponse> = await this.api.get(
			`/api/predictions?${params.toString()}`
		);
		return response.data;
	}

	async getMyPredictions(
		filters?: PredictionFilters
	): Promise<PredictionListResponse> {
		const params = new URLSearchParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.append(key, value.toString());
				}
			});
		}

		const response: AxiosResponse<PredictionListResponse> = await this.api.get(
			`/api/predictions/my?${params.toString()}`
		);
		return response.data;
	}

	async createPrediction(
		predictionData: CreatePredictionRequest
	): Promise<Prediction> {
		const response: AxiosResponse<Prediction> = await this.api.post(
			'/api/predictions',
			predictionData
		);
		return response.data;
	}

	async updatePrediction(
		id: string,
		predictionData: UpdatePredictionRequest
	): Promise<Prediction> {
		const response: AxiosResponse<Prediction> = await this.api.put(
			`/api/predictions/${id}`,
			predictionData
		);
		return response.data;
	}

	async deletePrediction(id: string): Promise<void> {
		await this.api.delete(`/api/predictions/${id}`);
	}

	async getLeaderboard(): Promise<LeaderboardResponse> {
		const response: AxiosResponse<LeaderboardResponse> = await this.api.get(
			'/api/predictions/leaderboard'
		);
		return response.data;
	}

	async calculatePoints(): Promise<{ message: string; updatedCount: number }> {
		const response = await this.api.post('/api/predictions/calculate-points');
		return response.data;
	}

	// Health check
	async healthCheck(): Promise<{ status: string; timestamp: string }> {
		const response = await this.api.get('/health');
		return response.data;
	}
}

export const apiService = new ApiService();
