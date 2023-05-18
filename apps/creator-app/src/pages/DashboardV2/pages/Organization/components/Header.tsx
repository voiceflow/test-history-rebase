import React from 'react';
import { generatePath } from 'react-router-dom';

import NavLink from '@/components/NavLink';
import Page from '@/components/Page';
import * as Sessions from '@/ducks/session';
import { useOrganizationMembersPagePath, useOrganizationSettingsPagePath, useOrganizationSSOPagePath } from '@/hooks/organization';
import { useSelector } from '@/hooks/redux';

import { WorkspaceSelector } from '../../../components';

const Header: React.FC = () => {
  const workspaceID = useSelector(Sessions.activeWorkspaceIDSelector) ?? 'unknown';
  const ssoPagePath = useOrganizationSSOPagePath();
  const membersPagePath = useOrganizationMembersPagePath();
  const settingsPagePath = useOrganizationSettingsPagePath();

  return (
    <Page.Header>
      <WorkspaceSelector />

      <Page.Header.LeftSection leftOffset={false} pl={16} gap={2}>
        {settingsPagePath && (
          <NavLink as={Page.Header.Tab} to={generatePath(settingsPagePath, { workspaceID })} exact>
            General
          </NavLink>
        )}

        {membersPagePath && (
          <NavLink as={Page.Header.Tab} to={generatePath(membersPagePath, { workspaceID })} exact>
            All Members
          </NavLink>
        )}

        {ssoPagePath && (
          <NavLink as={Page.Header.Tab} to={generatePath(ssoPagePath, { workspaceID })} exact>
            SAML SSO
          </NavLink>
        )}
      </Page.Header.LeftSection>
    </Page.Header>
  );
};

export default Header;
