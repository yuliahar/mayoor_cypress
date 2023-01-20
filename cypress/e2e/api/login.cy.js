import {apiLogin} from "../../helpers/api";

describe('/auth/login', function () {
  it('should login with valid credentials', function () {
    const user = {
      "email": "admin",
      "password": "admin"
    };

    Cypress.log({
      name: 'loginAPI',
      message: `🔐 Authenticating: ${user.email}`,
    });

      const token = apiLogin(user);
      expect(token).to.not.be.empty;
  });
});
