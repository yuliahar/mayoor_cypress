import { generateRandomUser } from '../../../utils/randomizer';
import { apiCreateUser, apiLogin } from '../../../helpers/api';
import { INSECURE_PASSWORD, INVALID_EMAIL, LONG_PASSWORD, SHORT_PASSWORD } from '../../../constants/users';
import { invalidPasswords } from '../../../data/auth';

describe('/users/addUser', function () {
	it('should create user with valid data and then login', function () {
		const testUser = generateRandomUser();

		apiCreateUser(testUser).then(res => {
			expect(res.body.data.addUser.id).to.be.not.null;
			expect(res.body.data.addUser.name).to.eq(testUser.name);
			expect(res.body.data.addUser.email).to.eq(testUser.email);
			expect(res.body.data.addUser.role).to.eq(testUser.role);
			expect(res.body.data.addUser.canBeEdited).to.eq(true);
			apiLogin(testUser).then(res => {
				expect(res.body.data.login.token).to.be.not.null;
			});
		});
	});

	it('should create user with only required data', function () {
		const testUser = generateRandomUser();
		delete testUser.role;
		delete testUser.name;

		apiCreateUser(testUser).then(res => {
			expect(res.body.data.addUser.id).to.be.not.null;
			expect(res.body.data.addUser.name).to.eq(null);
			expect(res.body.data.addUser.email).to.eq(testUser.email);
			expect(res.body.data.addUser.role).to.eq('FACTORY');
			expect(res.body.data.addUser.canBeEdited).to.eq(true);
		});
	});

	it('should return error when creating a user with already used email / username', function () {
		const testUser = generateRandomUser();

		apiCreateUser(testUser).then(() => {
			apiCreateUser(testUser).then(res => {
				expect(res.body.errors[0].message).to.eq(`User with email "${testUser.email}" already exists`);
			});
		});
	});

	it('should return error when creating a user with invalid email', function () {
		const testUser = generateRandomUser({ email: 'invalidEmail' });

		apiCreateUser(testUser).then(res => {
			expect(res.body.errors[0].message).to.eq(INVALID_EMAIL);
		});
	});

	it('should return error when creating a user with empty email', function () {
		const testUser = generateRandomUser({ email: '' });

		apiCreateUser(testUser).then(res => {
			expect(res.body.errors[0].message).to.eq(INVALID_EMAIL);
		});
	});

	it('should return error when creating a user with empty password', function () {
		const testUser = generateRandomUser({ password: '' });

		apiCreateUser(testUser).then(res => {
			expect(res.body.errors[0].message).to.eq(SHORT_PASSWORD);
		});
	});

	it('should return error when creating a user with short password', function () {
		const testUser = generateRandomUser({ password: '123' });

		apiCreateUser(testUser).then(res => {
			expect(res.body.errors[0].message).to.eq(SHORT_PASSWORD);
		});
	});

	it('should return error when creating a user with long password', function () {
		const testUser = generateRandomUser({ password: '134365576797654jknhberbfuer' });

		apiCreateUser(testUser).then(res => {
			expect(res.body.errors[0].message).to.eq(LONG_PASSWORD);
		});
	});

	invalidPasswords.forEach(password => {
		it('should return error when creating a user with insecure password: ' + password, function () {
			const testUser = generateRandomUser({ password: password });

			apiCreateUser(testUser).then(res => {
				expect(res.body.errors[0].message).to.eq(INSECURE_PASSWORD);
			});
		});
	});

	it('should create a user with empty name', function () {
		const testUser = generateRandomUser({ name: '' });

		apiCreateUser(testUser).then(res => {
			expect(res.body.data.addUser.name).to.eq(testUser.name);
		});
	});
});
