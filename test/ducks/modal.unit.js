import modalReducer, * as Modal from '@/ducks/modal';

import suite from './_suite';

const MOCK_STATE = {
  confirmModal: { message: 'something' },
  errorModal: { message: 'something' },
  modal: { value: 'something' },
};

suite('Ducks - Modal', ({ expect, spy, describeReducer }) => {
  describeReducer(Modal, MOCK_STATE, (utils) => {
    describe('setConfirm()', () => {
      const message = 'are you sure you want to quit?';

      it('should set a confirmation modal', () => {
        const confirmCallback = spy();

        const nextState = modalReducer(MOCK_STATE, Modal.setConfirm({ message, confirm: confirmCallback }));

        expect(nextState.confirmModal.message).to.eq(message);

        nextState.confirmModal.confirm();

        expect(confirmCallback).to.be.calledWithExactly();
      });

      it('should set a confirmation modal with params', () => {
        const params = ['a', 'b', 'c'];
        const confirmCallback = spy();

        const nextState = modalReducer(MOCK_STATE, Modal.setConfirm({ message, params, confirm: confirmCallback }));

        nextState.confirmModal.confirm();

        expect(confirmCallback).to.be.calledWithExactly(...params);
      });
    });

    describe('setError()', () => {
      const message = 'failed to perform action';

      it('should set a simple error modal', () => {
        utils.expectDiff(Modal.setError(message), { errorModal: { message } });
      });

      it('should set an error modal from an object', () => {
        utils.expectDiff(Modal.setError({ data: message }), { errorModal: { data: message, message } });
      });
    });

    describe('setModal()', () => {
      it('should set the active modal', () => {
        const modal = { value: 'prompt user' };

        utils.expectDiff(Modal.setModal(modal), { modal });
      });
    });

    describe('clearModal()', () => {
      it('should clear all modals', () => {
        expect(Modal.default(MOCK_STATE, Modal.clearModal())).to.eq(Modal.INITIAL_STATE);
      });
    });
  });
});
