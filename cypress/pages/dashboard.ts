export default {
  el: {
    get newProjectButton() {
      return cy.get('#dashboard a');
    },
    get workspaceDropdownButton() {
      return cy.get('#workspaceDropdown');
    },
    get projectList() {
      return cy.get('.main-list');
    },
    get projectListItem() {
      return cy.get('.projects-list__list-item');
    },
    get projectListItemTitle() {
      return cy.get('.projects-list__item-title');
    },
  },

  meta: {
    route: /\/workspace\/.*/,
  },
};
