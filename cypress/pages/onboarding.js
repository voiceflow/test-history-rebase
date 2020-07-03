export default {
  continue() {
    cy.get('.btn-primary').click();
  },
  setCompanyName(name) {
    cy.get('input[name="company_name"]').type(name);
  },
  setCompanySize(size) {
    cy.get('input[name="company_size"]').type(size);
  },
  selectRole(role) {
    cy.get('.select-box__control').click();

    cy.get('.select-box__menu .select-box__option').contains(role).click();
  },

  el: {
    get greeting() {
      return cy.get('.modal-bg-txt');
    },
    get surveyOption() {
      return cy.get('.button-card');
    },
    get soloProjectButton() {
      return this.surveyOption.first();
    },
    get teamProjectButton() {
      return this.surveyOption.last();
    },
    get designAndPrototypeButton() {
      return this.surveyOption.first();
    },
    get buildAndPublishButton() {
      return this.surveyOption.last();
    },
    get lowExperienceButton() {
      return this.surveyOption.eq(0);
    },
    get midExperienceButton() {
      return this.surveyOption.eq(1);
    },
    get highExperienceButton() {
      return this.surveyOption.eq(2);
    },
  },

  meta: {
    route: '/onboarding',
  },
};
