import React from 'react';
import { useSelector } from 'react-redux';

import { UserRole } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { ImportButton, NotificationsButton, ResourcesHeaderButton, SettingsButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';

const RightNavSection = () => {
  const userRole = useSelector(Workspace.userRoleSelector);

  return (
    <>
      <SubHeaderItem>
        <SettingsButton />
      </SubHeaderItem>

      {userRole !== UserRole.LIBRARY && (
        <SubHeaderItem>
          <ImportButton />
        </SubHeaderItem>
      )}

      <SubHeaderItem>
        <NotificationsButton />
      </SubHeaderItem>

      <SubHeaderItem>
        <ResourcesHeaderButton />
      </SubHeaderItem>
    </>
  );
};

export default RightNavSection;
