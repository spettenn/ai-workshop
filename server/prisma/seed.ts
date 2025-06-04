import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Starting database seeding...');

	// Create demo users
	const users = [
		{
			email: 'alice@company.com',
			name: 'Alice Johnson',
			department: 'Engineering',
			password: await bcrypt.hash('password123', 10),
		},
		{
			email: 'bob@company.com',
			name: 'Bob Smith',
			department: 'Marketing',
			password: await bcrypt.hash('password123', 10),
		},
		{
			email: 'charlie@company.com',
			name: 'Charlie Brown',
			department: 'Sales',
			password: await bcrypt.hash('password123', 10),
		},
	];

	console.log('👥 Creating users...');
	const createdUsers: any[] = [];
	for (const userData of users) {
		const user = await prisma.user.upsert({
			where: { email: userData.email },
			update: userData,
			create: userData,
		});
		createdUsers.push(user);
		console.log(`   ✓ ${user.name} (${user.email})`);
	}

	// Create World Cup matches with some finished matches for testing
	const matches = [
		{
			homeTeam: 'Brazil',
			awayTeam: 'Argentina',
			kickoffTime: new Date('2025-06-15T20:00:00Z'),
			status: 'FINISHED',
			homeScore: 2,
			awayScore: 1,
			round: 'Group A',
			venue: 'MetLife Stadium, New Jersey',
		},
		{
			homeTeam: 'Germany',
			awayTeam: 'Spain',
			kickoffTime: new Date('2025-06-16T18:00:00Z'),
			status: 'FINISHED',
			homeScore: 1,
			awayScore: 1,
			round: 'Group B',
			venue: 'Rose Bowl, Los Angeles',
		},
		{
			homeTeam: 'France',
			awayTeam: 'England',
			kickoffTime: new Date('2025-06-17T21:00:00Z'),
			status: 'LIVE',
			homeScore: 1,
			awayScore: 0,
			round: 'Group C',
			venue: 'AT&T Stadium, Dallas',
		},
		{
			homeTeam: 'Italy',
			awayTeam: 'Netherlands',
			kickoffTime: new Date('2025-06-18T19:00:00Z'),
			status: 'SCHEDULED',
			homeScore: null,
			awayScore: null,
			round: 'Group D',
			venue: 'Mercedes-Benz Stadium, Atlanta',
		},
		{
			homeTeam: 'Portugal',
			awayTeam: 'Belgium',
			kickoffTime: new Date('2025-06-19T22:00:00Z'),
			status: 'SCHEDULED',
			homeScore: null,
			awayScore: null,
			round: 'Group E',
			venue: 'Lincoln Financial Field, Philadelphia',
		},
		{
			homeTeam: 'Mexico',
			awayTeam: 'USA',
			kickoffTime: new Date('2025-06-20T20:00:00Z'),
			status: 'SCHEDULED',
			homeScore: null,
			awayScore: null,
			round: 'Group F',
			venue: 'Azteca Stadium, Mexico City',
		},
	];

	console.log('⚽ Creating matches...');
	const createdMatches: any[] = [];
	for (const matchData of matches) {
		const match = await prisma.match.upsert({
			where: {
				id: `${matchData.homeTeam}-${matchData.awayTeam}-${matchData.kickoffTime.getTime()}`,
			},
			update: matchData,
			create: matchData,
		});
		createdMatches.push(match);
		console.log(
			`   ✓ ${match.homeTeam} vs ${match.awayTeam} (${match.status})`
		);
	}

	// Create sample predictions for finished matches to test scoring
	const predictions = [
		// Brazil vs Argentina (2-1) - Alice's predictions
		{
			userId: createdUsers[0].id, // Alice
			matchId: createdMatches[0].id, // Brazil vs Argentina
			homeGoals: 2,
			awayGoals: 1,
			points: 3, // Exact score
		},
		{
			userId: createdUsers[1].id, // Bob
			matchId: createdMatches[0].id, // Brazil vs Argentina
			homeGoals: 1,
			awayGoals: 0,
			points: 1, // Correct winner only
		},
		{
			userId: createdUsers[2].id, // Charlie
			matchId: createdMatches[0].id, // Brazil vs Argentina
			homeGoals: 0,
			awayGoals: 2,
			points: 0, // Incorrect
		},

		// Germany vs Spain (1-1) - Draw predictions
		{
			userId: createdUsers[0].id, // Alice
			matchId: createdMatches[1].id, // Germany vs Spain
			homeGoals: 1,
			awayGoals: 1,
			points: 3, // Exact score
		},
		{
			userId: createdUsers[1].id, // Bob
			matchId: createdMatches[1].id, // Germany vs Spain
			homeGoals: 0,
			awayGoals: 0,
			points: 2, // Correct winner (draw) + goal difference
		},
		{
			userId: createdUsers[2].id, // Charlie
			matchId: createdMatches[1].id, // Germany vs Spain
			homeGoals: 2,
			awayGoals: 0,
			points: 0, // Incorrect
		},

		// France vs England (1-0) - Live match predictions
		{
			userId: createdUsers[0].id, // Alice
			matchId: createdMatches[2].id, // France vs England
			homeGoals: 2,
			awayGoals: 1,
			points: 0, // Will be calculated when match finishes
		},
		{
			userId: createdUsers[1].id, // Bob
			matchId: createdMatches[2].id, // France vs England
			homeGoals: 1,
			awayGoals: 0,
			points: 0, // Will be calculated when match finishes
		},

		// Italy vs Netherlands - Future match predictions
		{
			userId: createdUsers[0].id, // Alice
			matchId: createdMatches[3].id, // Italy vs Netherlands
			homeGoals: 2,
			awayGoals: 1,
			points: 0, // Will be calculated when match finishes
		},
		{
			userId: createdUsers[2].id, // Charlie
			matchId: createdMatches[3].id, // Italy vs Netherlands
			homeGoals: 1,
			awayGoals: 2,
			points: 0, // Will be calculated when match finishes
		},
	];

	console.log('🎯 Creating predictions...');
	for (const predictionData of predictions) {
		const prediction = await prisma.prediction.upsert({
			where: {
				userId_matchId: {
					userId: predictionData.userId,
					matchId: predictionData.matchId,
				},
			},
			update: predictionData,
			create: predictionData,
		});

		const user = createdUsers.find((u) => u.id === prediction.userId);
		const match = createdMatches.find((m) => m.id === prediction.matchId);
		console.log(
			`   ✓ ${user?.name}: ${match?.homeTeam} ${prediction.homeGoals}-${prediction.awayGoals} ${match?.awayTeam} (${prediction.points} pts)`
		);
	}

	// Create some sample comments
	const comments = [
		{
			content: 'Great match! Brazil looked strong in the first half.',
			userId: createdUsers[0].id,
			matchId: createdMatches[0].id,
		},
		{
			content: 'I think Argentina will come back in the second half.',
			userId: createdUsers[1].id,
			matchId: createdMatches[0].id,
		},
		{
			content: 'What a goal by Messi! 🔥',
			userId: createdUsers[2].id,
			matchId: createdMatches[0].id,
		},
		{
			content: 'This Germany vs Spain match is intense!',
			userId: createdUsers[1].id,
			matchId: createdMatches[1].id,
		},
	];

	console.log('💬 Creating comments...');
	for (const commentData of comments) {
		const comment = await prisma.comment.create({
			data: commentData,
		});

		const user = createdUsers.find((u) => u.id === comment.userId);
		console.log(`   ✓ ${user?.name}: "${comment.content}"`);
	}

	console.log('✅ Database seeding completed!');
	console.log('\n📊 Summary:');
	console.log(`   👥 Users: ${createdUsers.length}`);
	console.log(`   ⚽ Matches: ${createdMatches.length}`);
	console.log(`   🎯 Predictions: ${predictions.length}`);
	console.log(`   💬 Comments: ${comments.length}`);
	console.log('\n🔐 Demo accounts:');
	console.log('   alice@company.com / password123');
	console.log('   bob@company.com / password123');
	console.log('   charlie@company.com / password123');
}

main()
	.catch((e) => {
		console.error('❌ Seeding failed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
