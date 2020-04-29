import React from 'react';

import { ButtonVariant } from '@/components/Button/constants';
import Modal, { ModalFooter, ModalHeader } from '@/components/LegacyModal';
import Icon from '@/components/SvgIcon';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { BodyContainer, Button } from './components';

const Header: React.FC<any> = ModalHeader;

const RealtimeRestrictionModal: React.FC = () => {
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);
  const { isOpened, toggle } = useModals(ModalType.REALTIME_RESTRICTION);

  const onUnlock = React.useCallback(() => {
    openPaymentsModal();
    toggle();
  }, []);

  return (
    <Modal modalname="realtimeRestriction" isOpen={isOpened} toggle={toggle}>
      <Header toggle={toggle} header="Realtime Collaboration" />
      <BodyContainer column>
        <Icon icon="teamGroup" size={80} />
        <div>
          A teammate is actively editing this project. Real-time collaboration is a <span>Team</span> feature, please upgrade your plan to continue.
        </div>
      </BodyContainer>
      <ModalFooter>
        <Button onClick={toggle} variant={ButtonVariant.TERTIARY}>
          Cancel
        </Button>
        <Button onClick={onUnlock}>Unlock</Button>
      </ModalFooter>
    </Modal>
  );
};

export default RealtimeRestrictionModal;
