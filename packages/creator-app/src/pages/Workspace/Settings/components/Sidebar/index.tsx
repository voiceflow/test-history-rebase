import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavLinkSidebar from '@/components/NavLinkSidebar';
import PlanBubble from '@/components/PlanBubble';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { useActiveWorkspace, useFeature, usePermission } from '@/hooks';

const Sidebar: React.FC = () => {
  const workspace = useActiveWorkspace();
  const disableIntegration = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION)?.isEnabled;

  const [canConfigureOrganization] = usePermission(Permission.CONFIGURE_ORGANIZATION);
  const [canConfigureWorkspaceBilling] = usePermission(Permission.CONFIGURE_WORKSPACE_BILLING);
  const canConfigureWorkspaceDeveloper = usePermission(Permission.CONFIGURE_WORKSPACE_DEVELOPER)[0] && !disableIntegration;

  const canManageSSO = canConfigureOrganization && workspace?.organizationID;

  const pathParams = { workspaceID: workspace?.id };

  return (
    <NavLinkSidebar
      items={[
        { to: generatePath(Path.WORKSPACE_GENERAL_SETTINGS, pathParams), key: 'general', label: 'General' },

        canConfigureWorkspaceBilling
          ? {
              to: generatePath(Path.WORKSPACE_BILLING_SETTINGS, pathParams),
              key: 'billing',
              label: (
                <Box.Flex alignItems="center">
                  Billing&nbsp;&nbsp;
                  <PlanBubble plan={workspace?.plan} disabled />
                </Box.Flex>
              ),
            }
          : null,

        canManageSSO ? { to: generatePath(Path.WORKSPACE_SSO_SETTINGS, pathParams), key: 'sso', label: 'SSO' } : null,

        canConfigureWorkspaceDeveloper
          ? { to: generatePath(Path.WORKSPACE_DEVELOPER_SETTINGS, pathParams), key: 'developer', label: 'Developer' }
          : null,
      ]}
    />
  );
};

export default Sidebar;
