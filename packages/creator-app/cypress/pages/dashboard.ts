import { ClassName, DashboardClassName, Identifier } from '../../src/styles/constants';
import { getClass } from './utils';

export default {
  el: {
    get newProjectButton() {
      return cy.get(`#${Identifier.NEW_PROJECT_BUTTON}`);
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
      return cy.get(getClass(DashboardClassName.PROJECT_LIST_ITEM));
    },
    get projectListItemTitle() {
      return cy.get(getClass(DashboardClassName.PROJECT_LIST_ITEM_TITLE));
    },
    get projectListItemActionButton() {
      return cy.get(getClass(DashboardClassName.PROJECT_LIST_ITEM_ACTIONS));
    },
    get userMenu() {
      return cy.get(`.${ClassName.HEADER_USER_MENU}`);
    },
    get logoutButton() {
      return cy.get(`.${ClassName.MENU}`).find('li').contains('Logout');
    },
  },

  meta: {
    route: /\/workspace\/.*/,
  },
};
