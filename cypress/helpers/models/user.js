const { hash } = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ log: ['query', 'info'] });

module.exports.createUser = async ({ email, password, role, name, deleted = false, canBeEdited = true }) => {
	const hashPassword = await hash(password, 10);
	const user = await prisma.user.create({
		data: {
			email,
			password: hashPassword,
			name,
			role,
			deleted,
			canBeEdited,
		},
	});

	await prisma.$disconnect();
	return user;
};
