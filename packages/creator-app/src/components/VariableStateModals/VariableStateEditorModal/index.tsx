import React from 'react';

import { ModalType } from '@/constants';
import { useHotKeys, useModals } from '@/hooks';
import { Hotkey } from '@/keymap';

import VariableStatesModal from '../VariableStatesModal';

const VariableStateEditorModal: React.FC = () => {
  const { isOpened, close } = useModals<{ variableStateID?: string }>(ModalType.VARIABLE_STATE_EDITOR_MODAL);

  useHotKeys(Hotkey.CLOSE_VARIABLE_STATE_EDITOR_MODAL, close, { preventDefault: true }, [close]);

  if (!isOpened) return null;

  return <VariableStatesModal modalType={ModalType.VARIABLE_STATE_EDITOR_MODAL} saveText="Create Persona" title="Create Persona" />;
};

export default VariableStateEditorModal;
