const { hash } = require('bcrypt');
const fs = require('fs');
const prisma = require('../db');

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

module.exports.createAdminUser = async () => {
	const adminData = JSON.parse(fs.readFileSync('cypress/fixtures/admin.json').toString());
	adminData.canBeEdited = false;
	return module.exports.createUser(adminData);
};

module.exports.deleteMany = prisma.user.deleteMany;
