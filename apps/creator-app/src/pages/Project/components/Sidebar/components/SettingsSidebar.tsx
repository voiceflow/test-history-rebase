import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

import CanvasIconMenu from './CanvasIconMenu';

const SettingsSidebar: React.FC = () => {
  const versionID = useSelector(Session.activeVersionIDSelector)!;

  return (
    <>
      <CanvasIconMenu />

      <NavigationSidebar>
        <NavigationSidebar.ItemsContainer>
          <NavigationSidebar.NavItem icon="filter" to={generatePath(Path.PROJECT_GENERAL_SETTINGS, { versionID })} title="General" />
          <NavigationSidebar.NavItem icon="group" to={generatePath(Path.PROJECT_ENVIRONMENT_SETTINGS, { versionID })} title="Environments" />
          <NavigationSidebar.NavItem icon="versions" to={generatePath(Path.PROJECT_BACKUP_SETTINGS, { versionID })} title="Backups" />
        </NavigationSidebar.ItemsContainer>
      </NavigationSidebar>
    </>
  );
};

export default SettingsSidebar;
