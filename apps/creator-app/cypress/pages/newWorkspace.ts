export default {
  el: {
    get newWorkspaceButton() {
      return cy.get('#createWorkspace');
    },
  },
  meta: {
    route: /\/dashboard/,
  },
};
