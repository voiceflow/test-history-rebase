import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Popper, { PopperContent, PopperFooter } from '@/components/Popper';
import { Permission } from '@/config/permissions';
import { PlatformType, UserRole } from '@/constants';
import * as Project from '@/ducks/project';
import { usePermission, useSelector } from '@/hooks';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { getPlatformValue } from '@/utils/platform';

import { MenuContent, MenuItemV2, SharePrototype } from './components';

interface ShareProjectProps {
  compile?: boolean;
}

const ShareProject: React.FC<ShareProjectProps> = ({ compile }) => {
  const platform = useSelector(Project.activePlatformSelector);
  const [canSharePrototype, { activeRole }] = usePermission(Permission.SHARE_PROTOTYPE);
  const isPrototypingMode = usePrototypingMode();

  const isViewer = activeRole === UserRole.VIEWER;

  return (
    <Popper
      width="438px"
      modifiers={{ offset: { offset: '0,8' } }}
      renderContent={() => (
        <PopperContent>
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
        </PopperContent>
      )}
      renderFooter={() =>
        canSharePrototype && (
          <PopperFooter>
            <SharePrototype compile={compile} />
          </PopperFooter>
        )
      }
    >
      {({ ref, onToggle }) =>
        isPrototypingMode ? (
          <Button id={Identifier.SHARE_BUTTON} ref={ref} disabled={isViewer} variant={ButtonVariant.PRIMARY} icon="link" onClick={onToggle}>
            Share Prototype
          </Button>
        ) : (
          <Button id={Identifier.SHARE_BUTTON} ref={ref} disabled={isViewer} variant={ButtonVariant.QUATERNARY} onClick={onToggle}>
            Share
          </Button>
        )
      }
    </Popper>
  );
};

export default ShareProject;
