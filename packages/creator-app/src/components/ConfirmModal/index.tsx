import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { styled, units } from '@/hocs';
import { useModals } from '@/hooks/modals';
import { useEnableDisable } from '@/hooks/toggle';

export interface ConfirmProps {
  header?: string;
  body?: React.ReactNode;
  canCancel?: boolean;
  confirmButtonText?: string;
  confirm?: () => void | Promise<void>;
}

const ModalBody = styled(Box)`
  width: 100%;
  position: relative;
  padding: 0 ${units(4)}px ${units(4)}px ${units(4)}px;
`;

const ConfirmModal: React.FC = () => {
  const [loading, enableLoading, disableLoading] = useEnableDisable(false);

  const { data, close, isOpened } = useModals<ConfirmProps>(ModalType.CONFIRM);

  React.useEffect(() => {
    if (isOpened) {
      disableLoading();
    }
  }, [isOpened]);

  return (
    <Modal id={ModalType.CONFIRM} title={data.header} maxWidth={400}>
      <Box width="100%">
        <ModalBody>{data.body}</ModalBody>
        <ModalFooter>
          {data.canCancel && (
            <Box display="inline-block" mr={6}>
              <Button onClick={close} variant={ButtonVariant.TERTIARY} squareRadius>
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
            squareRadius
          >
            {data.confirmButtonText || 'Confirm'}
          </Button>
        </ModalFooter>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
