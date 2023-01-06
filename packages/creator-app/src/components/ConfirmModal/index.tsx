import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React, { CSSProperties } from 'react';

import Modal, { ModalFooter, ModalProps } from '@/components/Modal';
import { ModalType } from '@/constants';
import { styled, units } from '@/hocs/styled';
import { useModals } from '@/hooks/modals';
import { useEnableDisable } from '@/hooks/toggle';

export interface ConfirmProps {
  body?: React.ReactNode;
  header?: string;
  confirm?: () => void | Promise<void>;
  bodyStyle?: CSSProperties;
  cancelable?: boolean;
  modalProps?: Omit<ModalProps, 'id'>;
  footerStyle?: CSSProperties;
  cancelButtonText?: string | React.ReactNode;
  confirmButtonText?: string | React.ReactNode;
}

const ModalBody = styled(Box)`
  width: 100%;
  padding: 0 ${units(4)}px ${units(4)}px ${units(4)}px;
  position: relative;
`;

const ConfirmModal: React.OldFC = () => {
  const { data, close, isOpened } = useModals<ConfirmProps>(ModalType.CONFIRM);

  const [loading, enableLoading, disableLoading] = useEnableDisable(false);

  const onConfirm = async () => {
    enableLoading();

    await data.confirm?.();

    close();
    disableLoading();
  };

  React.useEffect(() => {
    if (isOpened) disableLoading();
  }, [isOpened]);

  return (
    <Modal id={ModalType.CONFIRM} title={data.header} maxWidth={400} {...data.modalProps}>
      <Box width="100%">
        <ModalBody style={data.bodyStyle}>{data.body}</ModalBody>

        <ModalFooter gap={12} style={data.footerStyle}>
          {(data.cancelable ?? true) && (
            <Button onClick={close} variant={ButtonVariant.TERTIARY} squareRadius>
              {data.cancelButtonText ?? 'Cancel'}
            </Button>
          )}

          <Button disabled={loading} onClick={onConfirm} squareRadius>
            {data.confirmButtonText ?? 'Confirm'}
          </Button>
        </ModalFooter>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
