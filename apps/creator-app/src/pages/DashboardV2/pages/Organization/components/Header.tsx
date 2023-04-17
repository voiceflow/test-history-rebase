import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';

import NavLink from '@/components/NavLink';
import Page from '@/components/Page';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import { useActiveWorkspace, useFeature, usePermission, useSelector } from '@/hooks';

import { WorkspaceSelector } from '../../../components';

const Header: React.FC = () => {
  const { workspaceID, organizationID } = useParams<{ workspaceID: string; organizationID: string }>();
  const organizationMembers = useFeature(Realtime.FeatureFlag.ORGANIZATION_MEMBERS);
  const [canManageOrgMembers] = usePermission(Permission.ORGANIZATION_MANAGE_MEMBERS, { organizationAdmin: true });
  const workspace = useActiveWorkspace();
  const [canConfigureOrganization] = usePermission(Permission.EDIT_ORGANIZATION);
  const orgSettings = useFeature(Realtime.FeatureFlag.ORG_GENERAL_SETTINGS);
  const user = useSelector(Account.userSelector);
  const canManageSSO = canConfigureOrganization && workspace?.organizationID;

  return (
    <Page.Header>
      <WorkspaceSelector />

      <Page.Header.LeftSection leftOffset={false} pl={16} gap={2}>
        {orgSettings.isEnabled && workspace?.id && (
          <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_ORGANIZATION_SETTINGS, { workspaceID: workspace.id, organizationID })} exact>
            General
          </NavLink>
        )}

        {organizationMembers.isEnabled && canManageOrgMembers && (
          <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_ORGANIZATION_MEMBERS, { workspaceID, organizationID })} exact>
            All Members
          </NavLink>
        )}

        {canManageSSO && user.isSSO && (
          <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_ORGANIZATION_SSO, { workspaceID: workspace?.id, organizationID })} exact>
            SAML SSO
          </NavLink>
        )}
      </Page.Header.LeftSection>
    </Page.Header>
  );
};

export default Header;
