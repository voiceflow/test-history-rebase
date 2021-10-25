import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { useEnableDisable, useModals } from '@/hooks';

export interface ConfirmProps {
  header?: string;
  body?: React.ReactNode;
  canCancel?: boolean;
  confirmButtonText?: string;
  confirm?: () => void | Promise<void>;
}

const ConfirmModal: React.FC = () => {
  const [loading, enableLoading, disableLoading] = useEnableDisable(false);

  const { data, close, isOpened } = useModals<ConfirmProps>(ModalType.CONFIRM);

  React.useEffect(() => {
    if (isOpened) {
      disableLoading();
    }
  }, [isOpened]);

  return (
    <Modal id={ModalType.CONFIRM} title={data.header}>
      <Box width="100%">
        <ModalBody>{data.body}</ModalBody>
        <ModalFooter>
          {data.canCancel && (
            <Box display="inline-block" mr={6}>
              <Button onClick={close} variant={ButtonVariant.TERTIARY}>
                Cancel
              </Button>
            </Box>
          )}
          <Button
            disabled={loading}
            onClick={async () => {
              enableLoading();
              await data.confirm?.();
              close();
              disableLoading();
            }}
          >
            {data.confirmButtonText || 'Confirm'}
          </Button>
        </ModalFooter>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
