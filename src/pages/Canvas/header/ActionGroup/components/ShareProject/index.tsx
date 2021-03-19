import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { ModalFooter } from '@/components/LegacyModal';
import { toast } from '@/components/Toast';
import { Permission } from '@/config/permissions';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useEnableDisable, usePermission, useTrackingEvents } from '@/hooks';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';
import { copy } from '@/utils/clipboard';
import { stopImmediatePropagation } from '@/utils/dom';

import PopupCloseIcon from '../PopupCloseIcon';
import PopupContainer from '../PopupContainer';
import PopupTransition from '../PopupTransition';
import { MenuContent, MenuItemV2, SharePrototype } from './components';

type ShareProjectProps = {
  render: boolean;
};

const ShareProject: React.FC<ShareProjectProps & ConnectedShareProjectProps> = ({ render, versionID, renderPrototype }) => {
  const [open, onOpen, onClose] = useEnableDisable(false);
  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [canInviteByLink] = usePermission(Permission.INVITE_BY_LINK);
  const [trackingEvents] = useTrackingEvents();

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
    <>
      {isPrototypingMode ? (
        <Button variant={ButtonVariant.PRIMARY} icon="link" onClick={onOpen}>
          Share Prototype
        </Button>
      ) : (
        <Button preventFocusStyle variant={ButtonVariant.QUATERNARY} large onClick={onOpen} isActive={open}>
          Share
        </Button>
      )}

      <PopupContainer open={open} width={438}>
        <PopupCloseIcon onClick={onClose} />
        <PopupTransition>
          <>
            {canSharePrototype ? (
              <MenuContent />
            ) : (
              <MenuItemV2
                isAllowed={false}
                title="Share Prototype"
                description="Share a testable version of your project that can be prototyped using voice, chat, or chip input."
              />
            )}
            {canInviteByLink && (
              <ModalFooter onClick={stopImmediatePropagation()}>
                <SharePrototype link={testableLink} onClick={onClickPrototype} isAllowed={canSharePrototype} onRenderPrototype={onRenderPrototype} />
              </ModalFooter>
            )}
          </>
        </PopupTransition>
      </PopupContainer>
    </>
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
