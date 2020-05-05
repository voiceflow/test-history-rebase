import React from 'react';

import Button from '@/components/Button';
import Modal, { ModalFooter, ModalHeader } from '@/components/LegacyModal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { BodyContainer, ButtonContainer, ContentContainer } from '@/pages/Dashboard/components/ModalComponents';

const Header: React.FC<any> = ModalHeader;

export type RedirectToPaymentBaseModalProps = {
  modalType: ModalType;
  header: string;
  icon: string;
  bodyContent: React.ReactNode;
  className?: string;
};

const RedirectToPaymentBaseModal: React.FC<RedirectToPaymentBaseModalProps> = ({ modalType, header, icon, bodyContent, className }) => {
  const { isOpened, toggle } = useModals(modalType);
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
    <Modal modalname="planRestriction" isOpen={isOpened} toggle={toggle} wrapClassName={className}>
      <Header toggle={toggle} header={header} />

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
    </Modal>
  );
};

export default RedirectToPaymentBaseModal;
