import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';

import NavLink from '@/components/NavLink';
import Page from '@/components/Page';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { useFeature } from '@/hooks/feature';
import { usePermission } from '@/hooks/permission';

import { WorkspaceSelector } from '../../../../components';

const Header: React.FC = () => {
  const { workspaceID, organizationID } = useParams<{ workspaceID: string; organizationID: string }>();

  const organizationMembers = useFeature(Realtime.FeatureFlag.ORGANIZATION_MEMBERS);
  const [canManageOrgMembers] = usePermission(Permission.ORGANIZATION_MANAGE_MEMBERS, { organizationAdmin: true });

  return (
    <Page.Header>
      <WorkspaceSelector />

      <Page.Header.LeftSection leftOffset={false} pl={16} gap={2}>
        {/* <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_ORGANIZATION_SETTINGS, { organizationID: organizationID })} exact>
          General
        </NavLink> */}

        {organizationMembers.isEnabled && canManageOrgMembers && (
          <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_ORGANIZATION_MEMBERS, { workspaceID, organizationID })} exact>
            All Members
          </NavLink>
        )}

        <NavLink as={Page.Header.Tab} to={generatePath(Path.WORKSPACE_ORGANIZATION_SSO, { workspaceID, organizationID })} exact>
          SAML SSO
        </NavLink>
      </Page.Header.LeftSection>
    </Page.Header>
  );
};

export default Header;
