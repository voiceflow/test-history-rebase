import React from 'react';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { styled } from '@/hocs';
import { useModals } from '@/hooks';
import { BodyContainer, ButtonContainer, ContentContainer } from '@/pages/Dashboard/components/ModalComponents';

export type RedirectToPaymentBaseModalProps = {
  modalType: ModalType;
  header: string;
  icon: string;
  bodyContent: React.ReactNode;
  className?: string;
};

const StyledModal = styled(Modal)`
  max-width: 392px;
`;

const RedirectToPaymentBaseModal: React.FC<RedirectToPaymentBaseModalProps> = ({ modalType, header, icon, bodyContent }) => {
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
    <StyledModal id={modalType} title={header} isSmall>
      <Box width="100%">
        <BodyContainer column>
          <img src={icon} alt="plan restriction" height={80} />

          <ContentContainer>{bodyContent}</ContentContainer>
        </BodyContainer>

        <ModalFooter>
          <ButtonContainer>
            <Button variant="tertiary" onClick={onToggle}>
              Cancel
            </Button>
          </ButtonContainer>

          <ButtonContainer>
            <Button onClick={onUnlock}>Unlock</Button>
          </ButtonContainer>
        </ModalFooter>
      </Box>
    </StyledModal>
  );
};

export default RedirectToPaymentBaseModal;
