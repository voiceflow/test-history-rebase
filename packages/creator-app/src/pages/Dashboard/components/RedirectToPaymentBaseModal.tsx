import { Box, Button, Flex, Link } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { styled } from '@/hocs/styled';
import { useModals } from '@/hooks';

export interface RedirectToPaymentBaseModalProps {
  modalType: ModalType;
  header: string;
  icon: string;
  bodyContent: React.ReactNode;
  className?: string;
  helpLink?: string;
}

const StyledModal = styled(Modal)`
  max-width: 392px;
`;

const ActionContainer = styled(Flex)`
  white-space: nowrap;
`;

const RedirectToPaymentBaseModal: React.OldFC<RedirectToPaymentBaseModalProps> = ({ modalType, header, icon, bodyContent, helpLink, className }) => {
  const { toggle } = useModals(modalType);
  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle();
  };

  const onUnlock = (e: React.MouseEvent) => {
    openPaymentModal();
    onToggle(e);
  };

  return (
    <StyledModal id={modalType} className={className} title={header}>
      <Box width="100%">
        <Modal.Body centred>
          <img src={icon} alt="plan restriction" height={80} />

          <Box mt={16}>{bodyContent}</Box>
        </Modal.Body>

        <ModalFooter gap={12} justifyContent="space-between">
          <div>{helpLink && <Link href={helpLink}>See more</Link>}</div>

          <ActionContainer>
            <Button squareRadius onClick={onUnlock}>
              Unlock
            </Button>
          </ActionContainer>
        </ModalFooter>
      </Box>
    </StyledModal>
  );
};

export default RedirectToPaymentBaseModal;
