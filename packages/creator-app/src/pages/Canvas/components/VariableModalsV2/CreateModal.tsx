import { Box, Button, ButtonVariant, Input, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { useCreateVariables } from '@/pages/Canvas/components/VariableModalsV2/hooks';

const CreateModal: React.FC = () => {
  const [variableText, setVariableText] = React.useState('');
  const { close, data, isOpened } = useModals<{ onCreate: (names: string[]) => void }>(ModalType.VARIABLE_CREATE);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const { onCreateMultiple } = useCreateVariables({ onCreate: data.onCreate });

  const handleCancel = () => {
    close();
  };

  useDidUpdateEffect(() => {
    if (isOpened) {
      inputRef.current?.focus();
    }
  }, [isOpened]);

  const handleCreate = async () => {
    onCreateMultiple(variableText);
    setVariableText('');
    close();
  };

  return (
    <Modal maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]} id={ModalType.VARIABLE_CREATE} title="Create Variable">
      <Box style={{ padding: '0 32px 24px 32px' }} fullWidth>
        <Input ref={inputRef} value={variableText} onChangeText={setVariableText} placeholder="variable 1, variable 2, variable 3..." />
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
