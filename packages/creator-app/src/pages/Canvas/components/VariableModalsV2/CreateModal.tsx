import { Box, Button, ButtonVariant, Input, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import { CanvasCreationType } from '@/ducks/tracking';
import { useModals } from '@/hooks';
import { useCreateVariables } from '@/pages/Canvas/components/VariableModalsV2/hooks';

const CreateModal: React.FC = () => {
  const { close, data, isOpened } = useModals<{
    name?: string;
    single?: boolean;
    onCreated?: (names: string[]) => void;
    creationType?: CanvasCreationType;
  }>(ModalType.VARIABLE_CREATE);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [variableText, setVariableText] = React.useState(data.name || '');

  const { isCreating, onCreateSingle, onCreateMultiple } = useCreateVariables({ onCreated: data.onCreated, creationType: data.creationType });

  const onCreate = async () => {
    if (!variableText.trim()) return;

    await (data.single ? onCreateSingle(variableText) : onCreateMultiple(variableText)).then(close);
  };

  useDidUpdateEffect(() => {
    if (!isOpened) return;

    setVariableText(data.name ?? '');
    inputRef.current?.focus();
  }, [isOpened]);

  return (
    <Modal id={ModalType.VARIABLE_CREATE} title="Create Variable" maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]}>
      <Box style={{ padding: '0 32px 24px 32px' }} fullWidth>
        <Input
          ref={inputRef}
          value={variableText}
          placeholder={data.single ? 'Enter variable name' : 'variable 1, variable 2, variable 3...'}
          onEnterPress={onCreate}
          onChangeText={setVariableText}
        />
      </Box>

      <ModalFooter justifyContent="flex-end">
        <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={close} style={{ marginRight: '10px' }}>
          Cancel
        </Button>

        <Button variant={ButtonVariant.PRIMARY} onClick={onCreate} disabled={!variableText.trim() || isCreating} minWidth={92} isLoading={isCreating}>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateModal;
