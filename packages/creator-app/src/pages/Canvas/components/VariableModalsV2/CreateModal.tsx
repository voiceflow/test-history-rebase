import { Box, Button, ButtonVariant, Input, toast } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { CanvasCreationType } from '@/ducks/tracking';
import * as Version from '@/ducks/version';
import { useDispatch, useModals } from '@/hooks';

import { VARIABLE_MODAL_WIDTH } from './constants';

const CreateModal: React.FC = () => {
  const [variableText, setVariableText] = React.useState('');
  const { close, data } = useModals<{ onCreate: (names: string[]) => void }>(ModalType.VARIABLE_CREATE);

  const createGlobalVar = useDispatch(Version.addGlobalVariable);

  const handleCancel = () => {
    close();
  };

  const handleCreate = async () => {
    const allNewVars = variableText.split(',');
    const newVarNames: string[] = [];

    allNewVars.forEach((varName) => {
      try {
        createGlobalVar(varName.trim(), CanvasCreationType.IMM);
        newVarNames.push(varName.trim());
      } catch (e) {
        toast.error(e);
      }
    });

    if (!newVarNames.length) {
      toast.error('Please address variable name issues and try again');
    } else {
      data.onCreate?.(newVarNames);
      setVariableText('');
      close();
    }
  };

  return (
    <Modal maxWidth={VARIABLE_MODAL_WIDTH} id={ModalType.VARIABLE_CREATE} title="Create Variable">
      <Box style={{ padding: '0 32px 24px 32px' }} fullWidth>
        <Input value={variableText} onChangeText={setVariableText} placeholder="variable 1, variable 2, variable 3..." />
      </Box>
      <ModalFooter justifyContent="flex-end">
        <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={handleCancel} style={{ marginRight: '10px' }}>
          Cancel
        </Button>
        <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={handleCreate}>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateModal;
