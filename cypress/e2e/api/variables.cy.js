// const apiGraphQLUrl = `${Cypress.env('apiUrl')}`;
//
// describe('Cypress variables ', function () {
//   const admin = {
//     email: 'admin',
//     password: 'admin',
//     role: 'EXECUTIVE',
//     name: 'John Doe',
//   };
//
//   context('problem with variables', function () {
//     it('logs token as undefined', function () {
//       console.log('>>> first log')
//       let token;
//
//       cy.api({
//         method: 'POST',
//         url: `${apiGraphQLUrl}`,
//         body: {
//           query: `mutation login ($email: String!, $password: String!) {
//             login (email: $email, password: $password) {
//                 token
//             }
//         }`,
//           variables: {
//             email: admin.email,
//             password: admin.password,
//           },
//         },
//       }).then(res => {
//         console.log('>>> second log')
//         token = res.body.data.login.token;
//       });
//
//       console.log('>>> third log')
//       console.log(token);
//     });
//   });
//
//   context('solution 1: move the desired code inside command chain', function () {
//     it('command chain', function () {
//       cy.api({
//         method: 'POST',
//         url: `${apiGraphQLUrl}`,
//         body: {
//           query: `mutation login ($email: String!, $password: String!) {
//             login (email: $email, password: $password) {
//                 token
//             }
//         }`,
//           variables: {
//             email: admin.email,
//             password: admin.password,
//           },
//         },
//       }).then(res => {
//         const token = res.body.data.login.token;
//         cy.api({
//           method: 'POST',
//           url: `${apiGraphQLUrl}`,
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: {
//             query: `query me {
//               me {
//                   id
//                   name
//                   email
//                   role
//                   canBeEdited
//                   }
//               }`
//           },
//         }).then(res => {
//           // pay attention that cy.log was put in chain and runs in the browser as last command
//           // after all expected assertions
//           cy.log(res.body.data.me);
//           expect(res.body.data.me.email).to.equal(admin.email);
//           expect(res.body.data.me.role).to.equal(admin.role);
//           expect(res.body.data.me.name).to.equal(admin.name);
//           expect(res.body.data.me.canBeEdited).to.equal(false);
//           expect(res.body.data.me).to.not.haveOwnProperty('password');
//         });
//       });
//     });
//   });
//
//   context('solution 2: use hooks', function () {
//     let token;
//
//     before('login user', function () {
//       cy.api({
//         method: 'POST',
//         url: `${apiGraphQLUrl}`,
//         body: {
//           query: `mutation login ($email: String!, $password: String!) {
//             login (email: $email, password: $password) {
//                 token
//             }
//         }`,
//           variables: {
//             email: admin.email,
//             password: admin.password,
//           },
//         },
//       }).then(res => {
//         token = res.body.data.login.token;
//       });
//     });
//
//     it('solution 2: use hooks', function () {
//       cy.log('token: ' + token);
//       cy.api({
//         method: 'POST',
//         url: `${apiGraphQLUrl}`,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: {
//           query: `query me {
//               me {
//                   id
//                   name
//                   email
//                   role
//                   canBeEdited
//                   }
//               }`
//         },
//       }).then(res => {
//         cy.log('response: ' + JSON.stringify(res.body.data.me));
//         expect(res.body.data.me.email).to.equal(admin.email);
//         expect(res.body.data.me.role).to.equal(admin.role);
//         expect(res.body.data.me.name).to.equal(admin.name);
//         expect(res.body.data.me.canBeEdited).to.equal(false);
//         expect(res.body.data.me).to.not.haveOwnProperty('password');
//       });
//     });
//   });
//
//   context('solution 3: use alias', function () {
//     it('solution 3: use alias', function () {
//       cy.api({
//         method: 'POST',
//         url: `${apiGraphQLUrl}`,
//         body: {
//           query: `mutation login ($email: String!, $password: String!) {
//             login (email: $email, password: $password) {
//                 token
//             }
//         }`,
//           variables: {
//             email: admin.email,
//             password: admin.password,
//           },
//         },
//       }).its('body.data.login.token').as('token');
//
//       cy.get('@token').then(token => {
//         cy.log('token: ' + token);
//         cy.api({
//           method: 'POST',
//           url: `${apiGraphQLUrl}`,
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: {
//             query: `query me {
//               me {
//                   id
//                   name
//                   email
//                   role
//                   canBeEdited
//                   }
//               }`
//           },
//         }).then(res => {
//           cy.log('response: ' + JSON.stringify(res.body.data.me));
//           expect(res.body.data.me.email).to.equal(admin.email);
//           expect(res.body.data.me.role).to.equal(admin.role);
//           expect(res.body.data.me.name).to.equal(admin.name);
//           expect(res.body.data.me.canBeEdited).to.equal(false);
//           expect(res.body.data.me).to.not.haveOwnProperty('password');
//         });
//       });
//     });
//   });
//
//   context('solution 4: use hooks and alias', function () {
//     before('login user', function () {
//       cy.api({
//         method: 'POST',
//         url: `${apiGraphQLUrl}`,
//         body: {
//           query: `mutation login ($email: String!, $password: String!) {
//             login (email: $email, password: $password) {
//                 token
//             }
//         }`,
//           variables: {
//             email: admin.email,
//             password: admin.password,
//           },
//         },
//       }).its('body.data.login.token').as('token');
//     });
//
//     it('solution 4: use hooks and alias', function () {
//       cy.log('token: ' + this.token);
//       cy.api({
//         method: 'POST',
//         url: `${apiGraphQLUrl}`,
//         headers: {
//           Authorization: `Bearer ${this.token}`,
//         },
//         body: {
//           query: `query me {
//               me {
//                   id
//                   name
//                   email
//                   role
//                   canBeEdited
//                   }
//               }`
//         },
//       }).then(res => {
//         cy.log('response: ' + JSON.stringify(res.body.data.me));
//         expect(res.body.data.me.email).to.equal(admin.email);
//         expect(res.body.data.me.role).to.equal(admin.role);
//         expect(res.body.data.me.name).to.equal(admin.name);
//         expect(res.body.data.me.canBeEdited).to.equal(false);
//         expect(res.body.data.me).to.not.haveOwnProperty('password');
//       });
//     });
//   });
// });
