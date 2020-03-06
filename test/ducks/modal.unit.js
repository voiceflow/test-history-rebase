import * as Modal from '@/ducks/modal';

import suite from './_suite';

const MOCK_STATE = {
  confirmModal: { message: 'something' },
  errorModal: { message: 'something' },
  modal: { value: 'something' },
};

suite(Modal, MOCK_STATE)('Ducks - Modal', ({ expect, spy, describeReducer }) => {
  describeReducer(({ applyAction, expectAction }) => {
    describe('setConfirm()', () => {
      const message = 'are you sure you want to quit?';

      it('should set a confirmation modal', () => {
        const confirmCallback = spy();

        const nextState = applyAction(Modal.setConfirm({ message, confirm: confirmCallback }));

        expect(nextState.confirmModal.message).to.eq(message);

        nextState.confirmModal.confirm();

        expect(confirmCallback).to.be.calledWithExactly();
      });

      it('should set a confirmation modal with params', () => {
        const params = ['a', 'b', 'c'];
        const confirmCallback = spy();

        const nextState = applyAction(Modal.setConfirm({ message, params, confirm: confirmCallback }));

        nextState.confirmModal.confirm();

        expect(confirmCallback).to.be.calledWithExactly(...params);
      });
    });

    describe('setError()', () => {
      const message = 'failed to perform action';

      it('should set a simple error modal', () => {
        expectAction(Modal.setError(message)).toModify({ errorModal: { message } });
      });

      it('should set an error modal from an object', () => {
        expectAction(Modal.setError({ data: message })).toModify({ errorModal: { data: message, message } });
      });
    });

    describe('setModal()', () => {
      it('should set the active modal', () => {
        const modal = { value: 'prompt user' };

        expectAction(Modal.setModal(modal)).toModify({ modal });
      });
    });

    describe('clearModal()', () => {
      it('should clear all modals', () => {
        expectAction(Modal.clearModal()).result.to.eq(Modal.INITIAL_STATE);
      });
    });
  });
});
