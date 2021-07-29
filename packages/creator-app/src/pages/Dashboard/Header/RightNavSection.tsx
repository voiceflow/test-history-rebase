import { UserRole } from '@voiceflow/internal';
import React from 'react';

import { useWorkspaceUserRoleSelector } from '@/hooks';
import { ImportButton, NotificationsButton, ResourcesHeaderButton, SettingsButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';

const RightNavSection = () => {
  const userRole = useWorkspaceUserRoleSelector();

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
