import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useFeature, useSelector } from '@/hooks';

import CanvasIconMenu from './CanvasIconMenu';

const SettingsSidebar: React.FC = () => {
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const isBackupsEnabled = useFeature(Realtime.FeatureFlag.BACKUPS).isEnabled;

  return (
    <>
      <CanvasIconMenu />

      <NavigationSidebar>
        <NavigationSidebar.ItemsContainer>
          <NavigationSidebar.NavItem icon="filter" to={generatePath(Path.PROJECT_GENERAL_SETTINGS, { versionID })} title="General" />
          <NavigationSidebar.NavItem icon="versions" to={generatePath(Path.PROJECT_VERSION_SETTINGS, { versionID })} title="Versions" />
          {isBackupsEnabled && (
            <NavigationSidebar.NavItem icon="versions" to={generatePath(Path.PROJECT_BACKUP_SETTINGS, { versionID })} title="Backups" />
          )}
        </NavigationSidebar.ItemsContainer>
      </NavigationSidebar>
    </>
  );
};

export default SettingsSidebar;
