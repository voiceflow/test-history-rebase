import React from 'react';

import { GENERAL_PLATFORMS } from '@/constants';
import { ResourcesHeaderButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';
import { PlatformContext } from '@/pages/Skill/contexts';
import { useCanvasMode } from '@/pages/Skill/hooks';

import { CanvasSettingsButton, GroupContainer, ShareProject, TestButton, UploadProjectGroup } from './components';

const ActionGroup: React.FC = () => {
  const isCanvasMode = useCanvasMode();
  const platform = React.useContext(PlatformContext);

  return (
    <>
      <GroupContainer>
        <ResourcesHeaderButton hasShortcuts />
        <SubHeaderItem>
          <CanvasSettingsButton />
        </SubHeaderItem>{' '}
      </GroupContainer>

      {isCanvasMode ? (
        <>
          {GENERAL_PLATFORMS.includes(platform!) ? (
            <UploadProjectGroup />
          ) : (
            <GroupContainer>
              <UploadProjectGroup />
            </GroupContainer>
          )}
          <GroupContainer>
            <ShareProject render />
          </GroupContainer>
          <TestButton />
        </>
      ) : (
        <>
          <GroupContainer>
            <ShareProject render />
          </GroupContainer>

          <UploadProjectGroup />
        </>
      )}
    </>
  );
};

export default ActionGroup;
