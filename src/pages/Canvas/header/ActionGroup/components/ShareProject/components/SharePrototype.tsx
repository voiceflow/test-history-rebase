import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { Link } from '@/components/Text';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { Container, DropdownContainer } from '@/pages/Collaborators/components/InviteByLink/components';

type SharePrototypeProps = {
  isAllowed: boolean;
  onClick: () => void;
  noIcon?: boolean;
};

const SharePrototype: React.FC<SharePrototypeProps> = ({ isAllowed, onClick }) => {
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  const handleCopyLink = () => {
    if (!isAllowed) {
      openPaymentsModal();
    } else {
      onClick();
    }
  };

  return (
    <Container>
      <DropdownContainer>
        <span>
          <Link href="https://docs.voiceflow.com/#/quickstart/testable-links">Learn More</Link>
        </span>
      </DropdownContainer>
      <Button variant={ButtonVariant.PRIMARY} icon={isAllowed ? 'link' : null} onClick={handleCopyLink}>
        <span>{isAllowed ? 'Copy Link' : 'Upgrade'}</span>
      </Button>
    </Container>
  );
};

export default SharePrototype as React.FC<SharePrototypeProps>;
