import { ClassName, DashboardClassName } from '../../src/styles/constants';
import { getClass } from './utils';

export default {
  el: {
    get newProjectButton() {
      return cy.get('#dashboard a');
    },
    get workspaceDropdownButton() {
      return cy.get('#workspaceDropdown');
    },
    get headerPrimaryNav() {
      return cy.get(getClass(ClassName.PRIMARY_NAV));
    },
    get headerSecondaryNav() {
      return cy.get(getClass(ClassName.SECONDARY_NAV));
    },
    get projectListsContainer() {
      return cy.get(getClass(DashboardClassName.LISTS_INNER));
    },
    get projectList() {
      return cy.get(getClass(DashboardClassName.LIST));
    },
    get projectListHeader() {
      return cy.get(getClass(DashboardClassName.LIST_HEADER));
    },
    get projectListItem() {
      return cy.get(getClass(DashboardClassName.PROJECTS_LIST_ITEM));
    },
    get projectListItemTitle() {
      return cy.get(getClass(DashboardClassName.PROJECTS_LIST_ITEM_TITLE));
    },
    get projectListItemActionButton() {
      return cy.get(getClass(DashboardClassName.PROJECTS_LIST_ITEM_ACTIONS));
    },
  },

  meta: {
    route: /\/workspace\/.*/,
  },
};
