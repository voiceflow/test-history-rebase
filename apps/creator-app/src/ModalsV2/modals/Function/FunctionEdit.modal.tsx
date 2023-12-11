import { SquareButton, Text } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';

import { modalsManager } from '../../manager';

export interface IFunctionEditModal {
  functionID: string;
}

export const FunctionEditModal = modalsManager.create<IFunctionEditModal>(
  'FunctionEditModal',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.onEscClose}>
          <Modal.Header
            title="Edit function"
            onClose={api.onClose}
            leftButton={<SquareButton iconName="Menu" />}
            secondaryButton={<SquareButton iconName="More" />}
          />

          {/* TODO: implement function edit modal */}
          <Text>not implemented yet</Text>

          <Modal.Footer>
            <Modal.Footer.Button label="Close" variant="secondary" onClick={api.onClose} disabled={closePrevented} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
