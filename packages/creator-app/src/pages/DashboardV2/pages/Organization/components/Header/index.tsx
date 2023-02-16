import React from 'react';
import { generatePath } from 'react-router-dom';

import NavLink from '@/components/NavLink';
import Page from '@/components/Page';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { useActiveWorkspace, usePermission } from '@/hooks';

import { WorkspaceSelector } from '../../../../components';

const Header: React.FC = () => {
  const workspace = useActiveWorkspace();
  const [canConfigureOrganization] = usePermission(Permission.CONFIGURE_ORGANIZATION);

  const canManageSSO = canConfigureOrganization && workspace?.id && workspace?.organizationID;
  return (
    <Page.Header>
      <WorkspaceSelector />

      <Page.Header.LeftSection leftOffset={false} pl={16} gap={2}>
        {/* {workspace?.id && (
          <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_GENERAL_ORG, { workspaceID: workspace.id })} exact>
            General
          </NavLink>
        )} */}

        {/* {workspace?.id && (
          <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_MEMBERS_ORG, { workspaceID: workspace.id })} exact>
            All Members
          </NavLink>
        )} */}

        {canManageSSO && (
          <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_SSO_ORG, { workspaceID: workspace?.id })} exact>
            SAML SSO
          </NavLink>
        )}
      </Page.Header.LeftSection>
    </Page.Header>
  );
};

export default Header;
