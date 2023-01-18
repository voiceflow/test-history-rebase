import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';
import { ImportButton, NotificationsButton, ResourcesHeaderButton, SettingsButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';

const RightNavSection = () => {
  const [canImportProject] = usePermission(Permission.IMPORT_PROJECT);

  return (
    <>
      <SubHeaderItem>
        <SettingsButton />
      </SubHeaderItem>

      {canImportProject && (
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
