import { Button, ButtonVariant, stopImmediatePropagation, toast } from '@voiceflow/ui';
import React from 'react';

import { ModalFooter } from '@/components/LegacyModal';
import { Permission } from '@/config/permissions';
import { PlatformType, UserRole } from '@/constants';
import * as Project from '@/ducks/project';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useEnableDisable, usePermission, useTrackingEvents } from '@/hooks';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { copy } from '@/utils/clipboard';
import { getPlatformValue } from '@/utils/platform';

import PopupCloseIcon from '../PopupCloseIcon';
import PopupContainer from '../PopupContainer';
import PopupTransition from '../PopupTransition';
import { MenuContent, MenuItemV2, SharePrototype } from './components';

type ShareProjectProps = {
  render: boolean;
};

const ShareProject: React.FC<ShareProjectProps & ConnectedShareProjectProps> = ({ render, platform, versionID, renderPrototype }) => {
  const [open, onOpen, onClose] = useEnableDisable(false);
  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [canSharePrototype, { activeRole }] = usePermission(Permission.SHARE_PROTOTYPE);
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

  const isViewer = activeRole === UserRole.VIEWER;

  return (
    <>
      {isPrototypingMode ? (
        <Button id={Identifier.SHARE_BUTTON} disabled={isViewer} variant={ButtonVariant.PRIMARY} icon="link" onClick={onOpen}>
          Share Prototype
        </Button>
      ) : (
        <Button id={Identifier.SHARE_BUTTON} disabled={isViewer} variant={ButtonVariant.QUATERNARY} onClick={onOpen} isActive={open}>
          Share
        </Button>
      )}

      {open && (
        <PopupContainer open={true} width={438}>
          <PopupCloseIcon onClick={onClose} />
          <PopupTransition>
            <>
              {canSharePrototype ? (
                <MenuContent />
              ) : (
                <MenuItemV2
                  isAllowed={false}
                  title="Share Prototype"
                  description={`Share a testable version of your project that can be prototyped using voice, chat, or ${getPlatformValue(
                    platform,
                    { [PlatformType.GOOGLE]: 'chips' },
                    'buttons'
                  )} input.`}
                />
              )}

              {canInviteByLink && (
                <ModalFooter onClick={stopImmediatePropagation()}>
                  <SharePrototype
                    link={testableLink}
                    onClick={onClickPrototype}
                    isAllowed={canSharePrototype}
                    onRenderPrototype={onRenderPrototype}
                  />
                </ModalFooter>
              )}
            </>
          </PopupTransition>
        </PopupContainer>
      )}
    </>
  );
};

const mapStateToProps = {
  platform: Project.activePlatformSelector,
  versionID: Session.activeVersionIDSelector,
};

const mapDispatchToProps = {
  renderPrototype: Prototype.renderPrototype,
};

type ConnectedShareProjectProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ShareProject) as React.FC<ShareProjectProps>;
