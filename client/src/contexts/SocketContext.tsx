'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { MatchUpdateEvent } from '@/types/match';

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	joinMatchRoom: (matchId: string) => void;
	leaveMatchRoom: (matchId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const socketInstance = io(
			process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
			{
				transports: ['websocket'],
			}
		);

		socketInstance.on('connect', () => {
			console.log('Connected to server');
			setIsConnected(true);
		});

		socketInstance.on('disconnect', () => {
			console.log('Disconnected from server');
			setIsConnected(false);
		});

		// Listen for match updates
		socketInstance.on('match:updated', (event: MatchUpdateEvent) => {
			console.log('Match update received:', event);

			if (event.type === 'SCORE_UPDATE') {
				toast.success(
					`⚽ Score Update: ${event.data.homeScore} - ${event.data.awayScore}`,
					{
						duration: 3000,
					}
				);
			} else if (event.type === 'STATUS_CHANGE') {
				toast.info(`📊 Match status changed to: ${event.data.status}`, {
					duration: 3000,
				});
			}
		});

		// Listen for match-specific score updates
		socketInstance.on('match:score', (event: MatchUpdateEvent) => {
			console.log('Match score update:', event);
		});

		// Listen for match status changes
		socketInstance.on('match:status', (event: MatchUpdateEvent) => {
			console.log('Match status change:', event);
		});

		// Listen for new matches
		socketInstance.on('match:created', (match: any) => {
			console.log('New match created:', match);
			toast.success(
				`🆕 New match added: ${match.homeTeam} vs ${match.awayTeam}`
			);
		});

		// Listen for deleted matches
		socketInstance.on('match:deleted', (data: { matchId: string }) => {
			console.log('Match deleted:', data);
			toast.info('Match has been removed');
		});

		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	const joinMatchRoom = (matchId: string) => {
		if (socket) {
			socket.emit('join-match', matchId);
			console.log(`Joined match room: ${matchId}`);
		}
	};

	const leaveMatchRoom = (matchId: string) => {
		if (socket) {
			socket.emit('leave-match', matchId);
			console.log(`Left match room: ${matchId}`);
		}
	};

	const value: SocketContextType = {
		socket,
		isConnected,
		joinMatchRoom,
		leaveMatchRoom,
	};

	return (
		<SocketContext.Provider value={value}>{children}</SocketContext.Provider>
	);
}

export function useSocket() {
	const context = useContext(SocketContext);
	if (context === undefined) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
}
