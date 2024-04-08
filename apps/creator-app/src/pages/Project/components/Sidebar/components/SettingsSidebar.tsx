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
          <NavigationSidebar.NavItem icon="filter" to={generatePath(Path.PROJECT_SETTINGS_GENERAL, { versionID })} title="General" />
          <NavigationSidebar.NavItem icon="group" to={generatePath(Path.PROJECT_SETTINGS_ENVIRONMENT, { versionID })} title="Environments" />
          <NavigationSidebar.NavItem icon="versions" to={generatePath(Path.PROJECT_SETTINGS_BACKUP, { versionID })} title="Backups" />
        </NavigationSidebar.ItemsContainer>
      </NavigationSidebar>
    </>
  );
};

export default SettingsSidebar;
