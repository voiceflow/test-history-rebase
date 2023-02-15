import React from 'react';
import { generatePath } from 'react-router-dom';

import NavLink from '@/components/NavLink';
import Page from '@/components/Page';
import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

import { WorkspaceSelector } from '../../../components';

const Header: React.FC = () => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  return (
    <Page.Header>
      <WorkspaceSelector />
      <Page.Header.LeftSection leftOffset={false} pl={16} gap={2}>
        <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_GENERAL_SETTINGS, { workspaceID })} exact>
          General
        </NavLink>
        <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_DEVELOPER_SETTINGS, { workspaceID })} exact>
          Developer
        </NavLink>
      </Page.Header.LeftSection>
    </Page.Header>
  );
};

export default Header;
