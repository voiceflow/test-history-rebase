import React from 'react';

import UploadProjectButton from '@/pages/Canvas/header/ActionGroup/components/UploadProjectButton';
import { SubHeaderItem } from '@/pages/Dashboard/Header/components';
import ResourcesHeaderButton from '@/pages/Dashboard/Header/components/ResourcesHeaderButton';

import ShareProject from './ShareProject';
import CanvasSettingsButton from './components/CanvasSettingsButton';
import { SubTitleGroup } from './styled';

function ActionGroup() {
  return (
    <>
      <SubTitleGroup>
        <ResourcesHeaderButton hasShortcuts />
        <SubHeaderItem>
          <CanvasSettingsButton />
        </SubHeaderItem>{' '}
      </SubTitleGroup>
      <SubTitleGroup>
        <ShareProject render />
      </SubTitleGroup>
      <UploadProjectButton />
    </>
  );
}

export default ActionGroup;
