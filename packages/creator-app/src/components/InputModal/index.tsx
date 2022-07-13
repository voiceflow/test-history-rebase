import { Box, Button, ButtonVariant, Flex, Input } from '@voiceflow/ui';
import React, { CSSProperties } from 'react';

import Modal, { ModalBody, ModalFooter, UncontrolledModalProps } from '@/components/Modal';
import { ModalType } from '@/constants';
import { useEnableDisable } from '@/hooks/toggle';

export interface InputModalProps {
  isOpened: boolean;
  close: () => any;
  modalType: ModalType;
  data: {
    canCancel?: boolean;
    header?: string | React.ReactNode;
    body?: string | React.ReactNode;
    input?: {
      placeholder?: string;
    };
    confirm?: {
      text?: string;
      onClick?: (inputVal: string) => any;
    };
    style?: {
      modalContainer?: Pick<UncontrolledModalProps, 'maxWidth' | 'maxHeight' | 'capitalizeText'>;
      body?: CSSProperties;
      footer?: CSSProperties;
    };
  };
}

const InputModal: React.FC<InputModalProps> = ({ modalType, isOpened, close, data }) => {
  const { canCancel = true, header, body, input, confirm, style } = data;

  const [inputVal, setInputVal] = React.useState('');

  const [loading, enableLoading, disableLoading] = useEnableDisable(false);

  React.useEffect(() => {
    if (isOpened) {
      disableLoading();
      setInputVal('');
    }
  }, [isOpened]);

  const confirmInput = React.useCallback(async () => {
    enableLoading();
    await confirm?.onClick?.(inputVal);

    close();

    disableLoading();
  }, [confirm, close, loading, inputVal]);

  return (
    <Modal id={modalType} title={header} {...style?.modalContainer}>
      <ModalBody style={style?.body}>
        <Flex column>
          {body}
          <Input value={inputVal} onChangeText={setInputVal} placeholder={input?.placeholder} onEnterPress={confirmInput} />
        </Flex>
      </ModalBody>

      <ModalFooter style={style?.footer}>
        {canCancel && (
          <Box mr={12}>
            <Button onClick={close} variant={ButtonVariant.TERTIARY} squareRadius={true}>
              Cancel
            </Button>
          </Box>
        )}

        <Button disabled={loading} onClick={confirmInput} squareRadius={true}>
          {confirm?.text || 'Confirm'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default InputModal;
