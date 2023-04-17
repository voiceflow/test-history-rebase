import { ClassName } from '../../../src/styles/constants';
import { getClass } from '../utils';

export default {
  el: {
    get root() {
      return cy.get(getClass(ClassName.MENU));
    },
    get item() {
      return this.root.should('be.visible').find(getClass(ClassName.MENU_ITEM));
    },
  },
};
