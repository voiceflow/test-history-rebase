import React from 'react';

import { ImportButton, NotificationsButton, ResourcesHeaderButton, SettingsButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';

const RightNavSection = () => (
  <>
    <SubHeaderItem>
      <SettingsButton />
    </SubHeaderItem>

    <SubHeaderItem>
      <ImportButton />
    </SubHeaderItem>

    <SubHeaderItem>
      <NotificationsButton />
    </SubHeaderItem>

    <SubHeaderItem>
      <ResourcesHeaderButton />
    </SubHeaderItem>
  </>
);

export default RightNavSection;
