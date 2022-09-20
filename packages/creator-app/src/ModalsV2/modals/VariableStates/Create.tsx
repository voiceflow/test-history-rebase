import { Modal } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';
import { VariableStateForm } from './components';

interface Props {
  variableStateID?: string;
}

const Create = manager.create<Props>('VariableStateCreate', () => ({ api, type, opened, hidden, animated, variableStateID }) => {
  useHotKeys(Hotkey.MODAL_CLOSE, api.close, { preventDefault: true }, [api.close]);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <VariableStateForm saveText="Create Persona" title="Create Persona" variableStateID={variableStateID} close={api.close} />
    </Modal>
  );
});

export default Create;
