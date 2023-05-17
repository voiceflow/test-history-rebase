import { System } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Path } from '@/config/routes';
import { LEARN_KNOWLEDGE_BASE } from '@/constants';
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
          <NavigationSidebar.NavItem icon="preview" to={generatePath(Path.PROJECT_KNOWLEDGE_BASE, { versionID })} title="Data Sources" />
          <System.Link.Anchor href={LEARN_KNOWLEDGE_BASE} color={System.Link.Color.INHERIT}>
            <NavigationSidebar.Item icon="noMatch" title="Docs">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </System.Link.Anchor>
        </NavigationSidebar.ItemsContainer>
      </NavigationSidebar>
    </>
  );
};

export default SettingsSidebar;
