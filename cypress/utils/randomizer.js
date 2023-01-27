import { faker } from '@faker-js/faker';

const DEFAULT_PASSWORD = 'Pa33word!';

export const generateRandomUser = options => {
	const user = {
		email: faker.internet.email(),
		password: DEFAULT_PASSWORD,
		role: faker.helpers.arrayElement(['EXECUTIVE', 'ADMINISTRATION', 'FACTORY']),
		name: faker.name.firstName() + ' ' + faker.name.lastName(),
	};
	return Object.assign(user, options);
};
