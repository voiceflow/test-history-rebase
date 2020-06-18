import React from 'react';

import UploadProjectButton from '@/pages/Canvas/header/ActionGroup/components/UploadProjectButton';
import { SubHeaderItem } from '@/pages/Dashboard/Header/components';
import ResourcesHeaderButton from '@/pages/Dashboard/Header/components/ResourcesHeaderButton';

import ShareProject from './ShareProject';
import CanvasSettingsButton from './components/CanvasSettingsButton';
import { GroupContainer } from './styled';

export { GroupContainer } from './styled';

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
