export default {
  setEmail: (email: string) => cy.get('input[name="email"]').type(email),

  setPassword: (password: string) => cy.get('input[name="password"]').type(password),

  submit: () => cy.get('button[type="submit"]').click(),

  el: {
    get googleLogin() {
      return cy.get('.social-button-light').first();
    },
    get facebookLogin() {
      return cy.get('.social-button-light').last();
    },
    get signupPrompt() {
      return cy.get('.auth__link');
    },
  },

  meta: {
    route: '/login',
  },
};
