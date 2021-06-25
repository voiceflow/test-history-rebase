import { Button, ButtonVariant, stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import { ModalFooter } from '@/components/LegacyModal';
import { Permission } from '@/config/permissions';
import { PlatformType, UserRole } from '@/constants';
import * as Project from '@/ducks/project';
import { useEnableDisable, usePermission, useSelector } from '@/hooks';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { getPlatformValue } from '@/utils/platform';

import PopupCloseIcon from '../PopupCloseIcon';
import PopupContainer from '../PopupContainer';
import PopupTransition from '../PopupTransition';
import { MenuContent, MenuItemV2, SharePrototype } from './components';

interface ShareProjectProps {
  compile?: boolean;
}

const ShareProject: React.FC<ShareProjectProps> = ({ compile }) => {
  const platform = useSelector(Project.activePlatformSelector);
  const [open, onOpen, onClose] = useEnableDisable(false);
  const [canSharePrototype, { activeRole }] = usePermission(Permission.SHARE_PROTOTYPE);
  const isPrototypingMode = usePrototypingMode();

  const isViewer = activeRole === UserRole.VIEWER;

  return (
    <>
      {isPrototypingMode ? (
        <Button id={Identifier.SHARE_BUTTON} disabled={isViewer} variant={ButtonVariant.PRIMARY} icon="link" onClick={onOpen}>
          Share Prototype
        </Button>
      ) : (
        <Button id={Identifier.SHARE_BUTTON} disabled={isViewer} variant={ButtonVariant.QUATERNARY} onClick={onOpen}>
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

              {canSharePrototype && (
                <ModalFooter onClick={stopImmediatePropagation()}>
                  <SharePrototype compile={compile} />
                </ModalFooter>
              )}
            </>
          </PopupTransition>
        </PopupContainer>
      )}
    </>
  );
};

export default ShareProject;
