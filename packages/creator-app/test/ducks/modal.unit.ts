import { Utils } from '@voiceflow/common';

import * as Modal from '@/ducks/modal';

import suite from './_suite';

const MOCK_STATE: Modal.ModalState = {
  confirmModal: { body: 'something', confirm: Utils.functional.noop },
  errorModal: { message: 'something' },
  modal: { value: 'something' } as any,
};

suite(Modal, MOCK_STATE)('Ducks - Modal', ({ describeReducer }) => {
  describeReducer(({ applyAction, expectAction }) => {
    describe('setConfirm()', () => {
      const body = 'are you sure you want to quit?';

      it('should set a confirmation modal', () => {
        const confirmCallback = vi.fn();

        const nextState = applyAction(Modal.setConfirm({ body, confirm: confirmCallback }));

        expect(nextState.confirmModal!.body).toBe(body);

        nextState.confirmModal!.confirm!();

        expect(confirmCallback).toBeCalledWith();
      });
    });

    describe('setModal()', () => {
      it('should set the active modal', () => {
        const modal = { value: 'prompt user' } as any;

        expectAction(Modal.setModal(modal)).toModify({ modal });
      });
    });

    describe('clearModal()', () => {
      it('should clear all modals', () => {
        expectAction(Modal.clearModal()).result.toBe(Modal.INITIAL_STATE);
      });
    });
  });
});
