const apiGraphQL = `${Cypress.env('apiUrl')}`;

export const apiLogin = user => {
  const token = cy.api({
    method: 'POST',
    url:`${apiGraphQL}`,
    body: {
      query: `mutation login ($email: String!, $password: String!) {
            login (email: $email, password: $password) {
                token
            }
        }`,
      variables: {
        email: user.email,
        password: user.password,
      },
    },
  }).then(response => {
    return response.body.data.login.token;
  });
  return token;
}
