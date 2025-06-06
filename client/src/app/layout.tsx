import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Eltek World Cup Betting Pool',
	description:
		'Internal betting pool for the FIFA World Cup 2026 - Eltek Holding',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<AuthProvider>
					<SocketProvider>
						<div className='min-h-screen bg-background'>
							<Navigation />
							<main className='relative'>{children}</main>
						</div>
						<Toaster position='top-right' richColors />
					</SocketProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
