export default {
  setEmail: (email: string) => cy.get('input[name="email"]').type(email),

  setPassword: (password: string) => cy.get('input[name="password"]').type(password),

  submit: () => cy.get('button[type="submit"]').click(),

  el: {
    get socialLogin() {
      return cy.get('.social-button-light');
    },
    get googleLogin() {
      return this.socialLogin.contains('Google');
    },
    get facebookLogin() {
      return this.socialLogin.contains('Facebook');
    },
    get ssoLogin() {
      return this.socialLogin.contains('SSO');
    },
    get signupPrompt() {
      return cy.get('.auth__link');
    },
  },

  meta: {
    route: '/login',
  },
};
