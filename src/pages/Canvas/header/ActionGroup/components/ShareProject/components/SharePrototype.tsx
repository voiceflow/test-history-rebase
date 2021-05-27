import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { Link } from '@/components/Text';
import * as Documentation from '@/config/documentation';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { useModals, usePermission } from '@/hooks';
import { Container, DropdownContainer } from '@/pages/Collaborators/components/InviteByLink/components';
import { Identifier } from '@/styles/constants';

type SharePrototypeProps = {
  link: string | null;
  onClick: () => void;
  isAllowed: boolean;
  onRenderPrototype?: () => void;
};

const SharePrototype: React.FC<SharePrototypeProps> = ({ link, onClick, isAllowed, onRenderPrototype }) => {
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);

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
          {canSharePrototype && link ? (
            <Link href={link} onClick={onRenderPrototype}>
              Open link in new tab
            </Link>
          ) : (
            <Link href={Documentation.PROTOTYPE_SHARE}>Learn More</Link>
          )}
        </span>
      </DropdownContainer>
      <Button id={Identifier.SHARE_COPY_LINK_BUTTON} variant={ButtonVariant.PRIMARY} icon={isAllowed ? 'link' : null} onClick={handleCopyLink}>
        <span>{isAllowed ? 'Copy Link' : 'Upgrade'}</span>
      </Button>
    </Container>
  );
};

export default SharePrototype as React.FC<SharePrototypeProps>;
