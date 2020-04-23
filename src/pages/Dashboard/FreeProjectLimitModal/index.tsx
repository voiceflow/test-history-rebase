import React from 'react';

import Modal, { ModalFooter, ModalHeader } from '@/components/LegacyModal';
import Icon from '@/components/SvgIcon';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { BodyContainer, Button } from './components';

const Header: any = ModalHeader;

const FreeProjectLimitModal: React.FC = () => {
  const { isOpened, toggle, data } = useModals<{ projects?: number; message?: string }>(ModalType.FREE_PROJECT_LIMIT);
  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);

  const onUnlock = () => {
    openPaymentModal();
    toggle();
  };

  return (
    <Modal modalname="freeProjectLimit" isOpen={isOpened} toggle={toggle}>
      <Header toggle={toggle} header="Free Project Limit" />
      <BodyContainer column>
        <Icon icon="projectLimit" size={80} />
        <div>
          {data.message || `You've reached your ${data.projects} free project limit`}. Upgrade to <span>unlock unlimited projects.</span>
        </div>
      </BodyContainer>

      <ModalFooter>
        <Button variant="tertiary" onClick={toggle}>
          Cancel
        </Button>
        <Button onClick={onUnlock}>Unlock</Button>
      </ModalFooter>
    </Modal>
  );
};

export default FreeProjectLimitModal;
