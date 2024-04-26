import { tid } from '@voiceflow/style';
import { Button, ButtonVariant, System, toast, ToastCallToAction } from '@voiceflow/ui';
import type { BaseProps } from '@voiceflow/ui-next';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { Permission } from '@/constants/permissions';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import { VariableStateAppliedType } from '@/ducks/tracking';
import { useAsyncEffect, useDispatch, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { usePaymentModal } from '@/hooks/modal.hook';
import {
  Container,
  DropdownContainer,
} from '@/pages/Project/components/Collaborators/components/InviteByLink/components';
import { NLUTrainingModelContext } from '@/pages/Project/contexts';
import { Identifier } from '@/styles/constants';
import { copy } from '@/utils/clipboard';

interface FooterProps extends BaseProps {
  isCanvas?: boolean;
}

const getTestableLink = (versionID: string | null, selectedPersonaID: string | null, canSharePrototype: boolean) => {
  let testableLink = canSharePrototype ? `${window.location.origin}/prototype/${versionID}` : null;
  if (testableLink && selectedPersonaID) {
    testableLink += `?persona=${selectedPersonaID}`;
  }

  return testableLink;
};

export const Footer: React.FC<FooterProps> = ({ isCanvas, testID }) => {
  const versionID = useSelector(Session.activeVersionIDSelector);
  const compilePrototype = useDispatch(Prototype.compilePrototype);
  const layoutType = useSelector(Prototype.prototypeLayoutSelector);
  const brandColor = useSelector(Prototype.prototypeBrandColorSelector);
  const password = useSelector(Prototype.prototypePasswordSelector);
  const brandImage = useSelector(Prototype.prototypeBrandImageSelector);
  const avatar = useSelector(Prototype.prototypeAvatarSelector);
  const selectedPersonaID = useSelector(Prototype.prototypeSelectedPersonaID);
  const nluTrainingModel = React.useContext(NLUTrainingModelContext);
  const { variableStateID } = useSelector(Prototype.prototypeSettingsSelector);
  const [isCompiled, setIsCompiled] = React.useState(false);

  const paymentModal = usePaymentModal();
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [canRenderPrototype] = usePermission(Permission.RENDER_PROTOTYPE);
  const [trackingEvents] = useTrackingEvents();

  const testableLink = getTestableLink(versionID, selectedPersonaID, canSharePrototype);

  const onRenderPrototype = () => {
    if (canRenderPrototype) compilePrototype();

    if (variableStateID) {
      trackingEvents.trackVariableStateApplied({ type: VariableStateAppliedType.SHAREABLE_LINK });
    }
  };

  const onCopyLink = () => {
    if (!canSharePrototype) {
      paymentModal.openVoid({});
      return;
    }

    onRenderPrototype();

    copy(testableLink);

    trackingEvents.trackTestableLinkCopy({ layout: layoutType, brandColor, password, brandImage, avatar });

    toast.success('Link copied to clipboard');

    if (!nluTrainingModel.isTrained) {
      toast.warn(
        <>
          Assistant is not fully trained. This may cause unexpected behaviour when prototyping.
          <ToastCallToAction onClick={() => nluTrainingModel.start({ origin: 'Share Prototype' })}>
            Train Assistant
          </ToastCallToAction>
        </>
      );
    }
  };

  useAsyncEffect(async () => {
    if (!isCanvas) return;

    if (canRenderPrototype) {
      await compilePrototype();
    }

    await nluTrainingModel.calculateDiff();

    setIsCompiled(true);
  }, [isCanvas]);

  return (
    <Container>
      <DropdownContainer>
        <span>
          {canSharePrototype && testableLink ? (
            <System.Link.Anchor href={testableLink} onClick={onRenderPrototype} data-testid={tid(testID, 'open-link')}>
              Open link in new tab
            </System.Link.Anchor>
          ) : (
            <System.Link.Anchor href={Documentation.PROTOTYPE_SHARE} data-testid={tid(testID, 'learn-more')}>
              Learn More
            </System.Link.Anchor>
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
