import React from 'react';
import { generatePath } from 'react-router-dom';

import NavLinkSidebar, { NavLinkItem } from '@/components/NavLinkSidebar';
import { Path } from '@/config/routes';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

import { SideBarComponentProps } from '../types';
import CanvasIconMenu from './CanvasIconMenu';
import IconMenuOffsetContainer from './IconMenuOffsetContainer';

const SettingsSidebar: React.FC<SideBarComponentProps> = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const versionID = useSelector(Session.activeVersionIDSelector)!;

  const items = React.useMemo<NavLinkItem[]>(() => {
    const platformItems = [{ to: generatePath(Path.PROJECT_VERSION_SETTINGS, { versionID }), key: 'version', label: 'Versions' }];
    return [{ to: generatePath(Path.PROJECT_GENERAL_SETTINGS, { versionID }), key: 'general', label: 'General' }, ...platformItems];
  }, [platform, versionID]);

  return (
    <IconMenuOffsetContainer>
      <CanvasIconMenu />

      <NavLinkSidebar items={items} />
    </IconMenuOffsetContainer>
  );
};

export default SettingsSidebar;
