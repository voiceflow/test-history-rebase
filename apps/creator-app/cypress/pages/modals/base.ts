import { ClassName } from '../../../src/styles/constants';
import { getClass } from '../utils';

export default (type: string) => ({
  el: {
    get root() {
      return cy.get(getClass(`${ClassName.MODAL}--${type}`));
    },
  },
});
