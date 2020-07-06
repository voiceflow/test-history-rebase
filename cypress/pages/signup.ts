export default {
  setName: (name: string) => cy.get('input[name="name"]').type(name),

  setEmail: (email: string) => cy.get('input[name="email"]').type(email),

  setPassword: (password: string) => cy.get('input[name="password"]').type(password),

  submit: () => cy.get('button[type="submit"]').click(),

  el: {
    get googleLogin() {
      return cy.get('.social-button').first();
    },
    get facebookLogin() {
      return cy.get('.social-button').last();
    },
    get loginPrompt() {
      return cy.get('.auth__link');
    },
  },

  meta: {
    route: '/signup',
  },
};
