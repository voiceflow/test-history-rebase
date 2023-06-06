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
        <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_PROFILE, { workspaceID })} exact>
          Profile
        </NavLink>
        <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_INTEGRATIONS, { workspaceID })} exact>
          Integrations
        </NavLink>
      </Page.Header.LeftSection>
    </Page.Header>
  );
};

export default Header;
