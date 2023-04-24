export default {
  setName: (name: string) => cy.get('input[name="name"]').type(name),

  el: {
    get regionCheckbox() {
      return cy.get('button.country-checkbox');
    },
    get activeRegionCheckbox() {
      return this.regionCheckbox.filter('.active');
    },
  },

  meta: {
    route: '/workspace/template',
  },
};
