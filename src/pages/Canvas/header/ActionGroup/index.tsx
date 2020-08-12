import React from 'react';

import { ResourcesHeaderButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';

import { CanvasSettingsButton, GroupContainer, ShareProject, UploadProjectButton } from './components';

function ActionGroup() {
  return (
    <>
      <GroupContainer>
        <ResourcesHeaderButton hasShortcuts />
        <SubHeaderItem>
          <CanvasSettingsButton />
        </SubHeaderItem>{' '}
      </GroupContainer>

      <GroupContainer>
        <ShareProject render />
      </GroupContainer>

      <UploadProjectButton />
    </>
  );
}

export default ActionGroup;
