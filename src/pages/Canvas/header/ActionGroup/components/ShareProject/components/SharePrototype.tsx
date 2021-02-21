import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { Link } from '@/components/Text';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { useFeature, useModals, usePermission } from '@/hooks';
import { Container, DropdownContainer } from '@/pages/Collaborators/components/InviteByLink/components';

type SharePrototypeProps = {
  link: string | null;
  onClick: () => void;
  isAllowed: boolean;
  onRenderPrototype?: () => void;
};

const SharePrototype: React.FC<SharePrototypeProps> = ({ link, onClick, isAllowed, onRenderPrototype }) => {
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);
  const sharePrototypeView = useFeature(FeatureFlag.SHARE_PROTOTYPE_VIEW);
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
          {canSharePrototype && sharePrototypeView.isEnabled && link ? (
            <Link href={link!} onClick={onRenderPrototype}>
              Open link in a new tab
            </Link>
          ) : (
            <Link href="https://docs.voiceflow.com/#/quickstart/testable-links">Learn More</Link>
          )}
        </span>
      </DropdownContainer>
      <Button variant={ButtonVariant.PRIMARY} icon={isAllowed ? 'link' : null} onClick={handleCopyLink}>
        <span>{isAllowed ? 'Copy Link' : 'Upgrade'}</span>
      </Button>
    </Container>
  );
};

export default SharePrototype as React.FC<SharePrototypeProps>;
