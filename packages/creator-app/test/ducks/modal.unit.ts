import { Utils } from '@voiceflow/common';

import * as Modal from '@/ducks/modal';

import suite from './_suite';

const MOCK_STATE: Modal.ModalState = {
  confirmModal: { body: 'something', confirm: Utils.functional.noop },
  errorModal: { message: 'something' },
  modal: { value: 'something' },
};

suite(Modal, MOCK_STATE)('Ducks - Modal', ({ expect, spy, describeReducer }) => {
  describeReducer(({ applyAction, expectAction }) => {
    describe('setConfirm()', () => {
      const body = 'are you sure you want to quit?';

      it('should set a confirmation modal', () => {
        const confirmCallback = spy();

        const nextState = applyAction(Modal.setConfirm({ body, confirm: confirmCallback }));

        expect(nextState.confirmModal!.body).to.eq(body);

        nextState.confirmModal!.confirm();

        expect(confirmCallback).to.be.calledWithExactly();
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
