import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Starting database seed...');

	// Clear existing data
	await prisma.comment.deleteMany();
	await prisma.prediction.deleteMany();
	await prisma.match.deleteMany();
	await prisma.user.deleteMany();

	// Create demo users
	const hashedPassword = await bcrypt.hash('password123', 10);

	const users = await Promise.all([
		prisma.user.create({
			data: {
				email: 'john@company.com',
				name: 'John Doe',
				department: 'Engineering',
				password: hashedPassword,
			},
		}),
		prisma.user.create({
			data: {
				email: 'jane@company.com',
				name: 'Jane Smith',
				department: 'Marketing',
				password: hashedPassword,
			},
		}),
		prisma.user.create({
			data: {
				email: 'bob@company.com',
				name: 'Bob Wilson',
				department: 'Sales',
				password: hashedPassword,
			},
		}),
	]);

	console.log(`✅ Created ${users.length} users`);

	// Create sample World Cup matches (Group Stage)
	const matches = await Promise.all([
		prisma.match.create({
			data: {
				homeTeam: 'Argentina',
				awayTeam: 'Saudi Arabia',
				kickoffTime: new Date('2024-12-20T14:00:00Z'),
				status: 'SCHEDULED',
				round: 'Group C',
				venue: 'Lusail Stadium',
			},
		}),
		prisma.match.create({
			data: {
				homeTeam: 'Brazil',
				awayTeam: 'Serbia',
				kickoffTime: new Date('2024-12-20T20:00:00Z'),
				status: 'SCHEDULED',
				round: 'Group G',
				venue: 'Stadium 974',
			},
		}),
		prisma.match.create({
			data: {
				homeTeam: 'France',
				awayTeam: 'Australia',
				kickoffTime: new Date('2024-12-21T16:00:00Z'),
				status: 'SCHEDULED',
				round: 'Group D',
				venue: 'Al Janoub Stadium',
			},
		}),
		prisma.match.create({
			data: {
				homeTeam: 'Spain',
				awayTeam: 'Costa Rica',
				kickoffTime: new Date('2024-12-21T17:00:00Z'),
				status: 'FINISHED',
				homeScore: 7,
				awayScore: 0,
				round: 'Group E',
				venue: 'Al Thumama Stadium',
			},
		}),
		prisma.match.create({
			data: {
				homeTeam: 'Germany',
				awayTeam: 'Japan',
				kickoffTime: new Date('2024-12-22T14:00:00Z'),
				status: 'FINISHED',
				homeScore: 1,
				awayScore: 2,
				round: 'Group E',
				venue: 'Khalifa International Stadium',
			},
		}),
	]);

	console.log(`✅ Created ${matches.length} matches`);

	// Create some sample predictions
	const predictions = await Promise.all([
		prisma.prediction.create({
			data: {
				userId: users[0].id,
				matchId: matches[0].id,
				homeGoals: 2,
				awayGoals: 1,
				points: 0,
			},
		}),
		prisma.prediction.create({
			data: {
				userId: users[1].id,
				matchId: matches[0].id,
				homeGoals: 1,
				awayGoals: 0,
				points: 0,
			},
		}),
		prisma.prediction.create({
			data: {
				userId: users[0].id,
				matchId: matches[3].id, // Spain vs Costa Rica (finished)
				homeGoals: 3,
				awayGoals: 0,
				points: 2, // Close prediction gets 2 points
			},
		}),
	]);

	console.log(`✅ Created ${predictions.length} predictions`);

	console.log('🎉 Database seeded successfully!');
}

main()
	.catch((e) => {
		console.error('❌ Error seeding database:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
