import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Import routes
import authRoutes from './routes/auth';
import matchRoutes from './routes/matches';
import predictionRoutes from './routes/predictions';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Allow both Next.js and Vite origins for development
const allowedOrigins = [
	'http://localhost:3000', // Next.js default
	'http://localhost:5173', // Vite default
	process.env.CLIENT_ORIGIN,
].filter((origin): origin is string => Boolean(origin));

const io = new SocketIOServer(server, {
	cors: {
		origin: allowedOrigins,
		methods: ['GET', 'POST'],
	},
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development',
	});
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/predictions', predictionRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
	console.log(`User connected: ${socket.id}`);

	// Handle user joining a room (for future match-specific updates)
	socket.on('join-match', (matchId: string) => {
		socket.join(`match-${matchId}`);
		console.log(`User ${socket.id} joined match room: ${matchId}`);
	});

	// Handle user leaving a room
	socket.on('leave-match', (matchId: string) => {
		socket.leave(`match-${matchId}`);
		console.log(`User ${socket.id} left match room: ${matchId}`);
	});

	// Handle disconnection
	socket.on('disconnect', () => {
		console.log(`User disconnected: ${socket.id}`);
	});
});

// Error handling middleware
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error('Error:', err);
		res.status(500).json({
			error: 'Internal server error',
			message:
				process.env.NODE_ENV === 'development'
					? err.message
					: 'Something went wrong',
		});
	}
);

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({
		error: 'Route not found',
		path: req.originalUrl,
	});
});

// Start server
server.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📊 Health check: http://localhost:${PORT}/health`);
	console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
	console.log(`⚽ Match endpoints: http://localhost:${PORT}/api/matches`);
	console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
	console.log(`🔗 CORS origins: ${allowedOrigins.join(', ')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM received, shutting down gracefully');
	server.close(() => {
		console.log('Process terminated');
	});
});

export { io };
