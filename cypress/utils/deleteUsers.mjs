import mongoose from 'mongoose';
import 'colors';

async function dropUsers() {
	let connection;

	const connectionString = 'mongodb://mongo1:30001,mongo2:30002,mongo3:30003/mayoor?replicaSet=my-replica-set';
	//const connectionString = 'mongodb+srv://admin:T5uMxbNQL5qx7Kut@cluster0.notgjl1.mongodb.net/mayoor?retryWrites=true&w=majority';

	const options = {
		useNewUrlParser: true,
		autoIndex: false,
		useUnifiedTopology: true,
	};

	await mongoose.connect(connectionString, options).catch(err => console.log(err));
	connection = await mongoose.connection;

	// await connection.dropDatabase();
	let count = await connection.collection('User').countDocuments();
	console.log(`users count: ${count}`.blue);

	const users = await connection.collection('User');

	if (connection.collection('User') && count > 0) {
		await users.deleteMany({ email: { $ne: 'admin' } });
		console.log('Users have been deleted!'.blue.inverse);
	}

	process.exit(0);
}

dropUsers()
