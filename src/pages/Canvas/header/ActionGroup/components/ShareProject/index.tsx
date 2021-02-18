import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import { ModalFooter } from '@/components/LegacyModal';
import { toast } from '@/components/Toast';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature, usePermission, useTrackingEvents } from '@/hooks';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';
import { copy } from '@/utils/clipboard';
import { stopImmediatePropagation } from '@/utils/dom';

import { MenuContainer, MenuContent, MenuItemV2, SharePrototype } from './components';

const Footer = ModalFooter as React.FC<any>;

type ShareProjectProps = {
  render: boolean;
};

const ShareProject: React.FC<ShareProjectProps & ConnectedShareProjectProps> = ({ render, versionID, renderPrototype }) => {
  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [canInviteByLink] = usePermission(Permission.INVITE_BY_LINK);
  const [trackingEvents] = useTrackingEvents();
  const sharePrototypeView = useFeature(FeatureFlag.SHARE_PROTOTYPE_VIEW);

  const isPrototypingMode = usePrototypingMode();

  const testableLink = canShareProject || canSharePrototype ? `${window.location.origin}/prototype/${versionID}` : null;

  const onRenderPrototype = () => renderPrototype({ aborted: false });

  const onClickPrototype = () => {
    if (render && canSharePrototype) {
      onRenderPrototype();

      copy(testableLink);

      trackingEvents.trackTestableLinkCopy();

      toast.success('Link copied to clipboard');
    } else if (!render) {
      toast.error('Unable to copy link to clipboard, please try again or contact support');
    }
  };

  return (
    <Dropdown
      placement="bottom"
      zIndex={999}
      preventOverflow={{ padding: 10, boundariesElement: document.body }}
      menu={() => (
        <MenuContainer onClick={stopImmediatePropagation()}>
          <FadeDownDelayedContainer>
            <>
              {canSharePrototype && sharePrototypeView.isEnabled ? (
                <MenuContent />
              ) : (
                <MenuItemV2
                  isAllowed={canSharePrototype}
                  title="Share Prototype"
                  description="Share a testable version of your project that can be prototyped using voice, chat, or chip input."
                />
              )}
              {canInviteByLink && (
                <Footer onClick={stopImmediatePropagation()}>
                  <SharePrototype
                    link={testableLink}
                    onClick={onClickPrototype}
                    isAllowed={canSharePrototype}
                    onRenderPrototype={onRenderPrototype}
                  />
                </Footer>
              )}
            </>
          </FadeDownDelayedContainer>
        </MenuContainer>
      )}
    >
      {(ref, onToggle, isOpen) =>
        isPrototypingMode ? (
          <Button
            ref={ref}
            variant={ButtonVariant.PRIMARY}
            icon="link"
            onClick={canSharePrototype && !sharePrototypeView.isEnabled ? onClickPrototype : onToggle}
          >
            Share Prototype
          </Button>
        ) : (
          <Button ref={ref} preventFocusStyle variant={ButtonVariant.QUATERNARY} large onClick={onToggle} isActive={isOpen}>
            Share
          </Button>
        )
      }
    </Dropdown>
  );
};

const mapStateToProps = {
  versionID: Skill.activeSkillIDSelector,
};

const mapDispatchToProps = {
  renderPrototype: Prototype.renderPrototype,
};

type ConnectedShareProjectProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ShareProject) as React.FC<ShareProjectProps>;
