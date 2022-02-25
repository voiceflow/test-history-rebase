import { Button, ButtonVariant, Link, toast } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import { VariableStateAppliedType } from '@/ducks/tracking';
import { useDispatch, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { Container, DropdownContainer } from '@/pages/Collaborators/components/InviteByLink/components';
import { Identifier } from '@/styles/constants';
import { copy } from '@/utils/clipboard';

interface SharePrototypeProps {
  inline?: boolean;
  compile?: boolean;
}

const SharePrototype: React.FC<SharePrototypeProps> = ({ inline, compile }) => {
  const versionID = useSelector(Session.activeVersionIDSelector);
  const compilePrototype = useDispatch(Prototype.compilePrototype);
  const layoutType = useSelector(Prototype.prototypeLayoutSelector);
  const brandColor = useSelector(Prototype.prototypeBrandColorSelector);
  const password = useSelector(Prototype.prototypePasswordSelector);
  const brandImage = useSelector(Prototype.prototypeBrandImageSelector);
  const avatar = useSelector(Prototype.prototypeAvatarSelector);
  const { variableStateID } = useSelector(Prototype.prototypeSettingsSelector);

  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);
  const [trackingEvents] = useTrackingEvents();

  const testableLink = canSharePrototype ? `${window.location.origin}/prototype/${versionID}` : null;

  const onRenderPrototype = () => {
    if (compile) {
      compilePrototype();
    }
    if (variableStateID) {
      trackingEvents.trackVariableStateApplied({ type: VariableStateAppliedType.SHAREABLE_LINK });
    }
  };

  const onCopyLink = () => {
    if (!canSharePrototype) {
      openPaymentsModal();
      return;
    }

    onRenderPrototype();

    copy(testableLink);

    trackingEvents.trackTestableLinkCopy({ layout: layoutType, brandColor, password, brandImage, avatar });

    toast.success('Link copied to clipboard');
  };

  return (
    <Container>
      <DropdownContainer>
        <span>
          {canSharePrototype && testableLink ? (
            <Link href={testableLink} onClick={onRenderPrototype}>
              Open link in new tab
            </Link>
          ) : (
            <Link href={Documentation.PROTOTYPE_SHARE}>Learn More</Link>
          )}
        </span>
      </DropdownContainer>

      <Button
        id={Identifier.SHARE_COPY_LINK_BUTTON}
        variant={ButtonVariant.PRIMARY}
        icon={!inline && canSharePrototype ? 'link' : null}
        onClick={onCopyLink}
      >
        <span>{canSharePrototype ? 'Copy Link' : 'Upgrade'}</span>
      </Button>
    </Container>
  );
};

export default SharePrototype;
