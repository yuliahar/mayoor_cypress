import { faker } from '@faker-js/faker';

const DEFAULT_PASSWORD = 'Pa33word!';

export const generateRandomUser = (options = {}) => {
	return {
		email: faker.internet.email(),
		password: DEFAULT_PASSWORD,
		role: faker.helpers.arrayElement(['EXECUTIVE', 'ADMINISTRATION', 'FACTORY']),
		name: faker.name.fullName(),
		...options,
	};
};
