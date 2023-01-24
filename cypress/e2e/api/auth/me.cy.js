import { apiGetCurrentUserInfo, apiLogin } from '../../../helpers/api';

describe('/me', function () {
	const admin = {
		email: 'admin',
		password: 'admin',
		role: 'EXECUTIVE',
		name: 'John Doe',
	};

	it('should return user info for valid authorized user', function () {
		apiLogin(admin);

		apiGetCurrentUserInfo().then(res => {
			expect(res.body.data.me.name).to.equal(admin.name);
			expect(res.body.data.me.email).to.equal(admin.email);
			expect(res.body.data.me.role).to.equal(admin.role);
		});
	});
});
