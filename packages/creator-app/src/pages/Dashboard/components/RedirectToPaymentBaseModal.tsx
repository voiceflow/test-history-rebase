import React from 'react';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Flex from '@/components/Flex';
import Modal, { ModalFooter } from '@/components/Modal';
import { Link } from '@/components/Text';
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
  helpLink?: string;
};

const StyledModal = styled(Modal)`
  max-width: 392px;
`;

const ActionContainer = styled(Flex)`
  white-space: nowrap;
`;

const RedirectToPaymentBaseModal: React.FC<RedirectToPaymentBaseModalProps> = ({ modalType, header, icon, bodyContent, helpLink, className }) => {
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
    <StyledModal id={modalType} className={className} title={header} isSmall>
      <Box width="100%">
        <BodyContainer column>
          <img src={icon} alt="plan restriction" height={80} />

          <ContentContainer>{bodyContent}</ContentContainer>
        </BodyContainer>

        <ModalFooter justifyContent="space-between">
          <div>{helpLink && <Link href={helpLink}>See more</Link>}</div>

          <ActionContainer>
            <ButtonContainer>
              <Button onClick={onUnlock}>Unlock</Button>
            </ButtonContainer>
          </ActionContainer>
        </ModalFooter>
      </Box>
    </StyledModal>
  );
};

export default RedirectToPaymentBaseModal;
