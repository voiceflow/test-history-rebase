import { Button, ButtonVariant, Link, toast, ToastCallToAction } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import { VariableStateAppliedType } from '@/ducks/tracking';
import * as Tracking from '@/ducks/tracking';
import { useAsyncEffect, useDispatch, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { Container, DropdownContainer } from '@/pages/Collaborators/components/InviteByLink/components';
import { TrainingModelContext } from '@/pages/Project/contexts';
import { Identifier } from '@/styles/constants';
import { copy } from '@/utils/clipboard';

interface FooterProps {
  isCanvas?: boolean;
}

const Footer: React.OldFC<FooterProps> = ({ isCanvas }) => {
  const versionID = useSelector(Session.activeVersionIDSelector);
  const compilePrototype = useDispatch(Prototype.compilePrototype);
  const layoutType = useSelector(Prototype.prototypeLayoutSelector);
  const brandColor = useSelector(Prototype.prototypeBrandColorSelector);
  const password = useSelector(Prototype.prototypePasswordSelector);
  const brandImage = useSelector(Prototype.prototypeBrandImageSelector);
  const avatar = useSelector(Prototype.prototypeAvatarSelector);
  const trainingModelAPI = React.useContext(TrainingModelContext);
  const { variableStateID } = useSelector(Prototype.prototypeSettingsSelector);
  const [isCompiled, setIsCompiled] = React.useState(false);

  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [canRenderPrototype] = usePermission(Permission.RENDER_PROTOTYPE);
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);
  const [trackingEvents] = useTrackingEvents();

  const testableLink = canSharePrototype ? `${window.location.origin}/prototype/${versionID}` : null;

  const onRenderPrototype = () => {
    if (canRenderPrototype) compilePrototype();

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
    if (!trainingModelAPI.isTrained) {
      toast.warn(
        <>
          Assistant is not fully trained. This may cause unexpected behaviour when prototyping.
          <ToastCallToAction onClick={() => trainingModelAPI.startTraining(Tracking.AssistantOriginType.TEST_TOOL)}>
            Train Assistant
          </ToastCallToAction>
        </>
      );
    }
  };

  useAsyncEffect(async () => {
    if (isCanvas) {
      if (canRenderPrototype) {
        await compilePrototype();
      }

      await trainingModelAPI.getDiff();
      setIsCompiled(true);
    }
  }, []);

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
        onClick={onCopyLink}
        style={{ width: 114 }}
        disabled={isCanvas && !isCompiled}
        isLoading={isCanvas && !isCompiled}
      >
        <span>{canSharePrototype ? 'Copy Link' : 'Upgrade'}</span>
      </Button>
    </Container>
  );
};

export default Footer;
