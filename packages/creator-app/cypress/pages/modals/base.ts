import { ModalType } from '../../../src/constants';
import { ClassName } from '../../../src/styles/constants';
import { getClass } from '../utils';

export default (type: ModalType) => ({
  el: {
    get root() {
      return cy.get(getClass(`${ClassName.MODAL}--${type}`));
    },
  },
});
