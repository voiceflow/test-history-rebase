import { PlanType } from '@voiceflow/internal';
import { Box } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, usePermission, useSelector } from '@/hooks';

import { Account, WorkspaceSelector } from './components';
import * as S from './styles';

const DashboardNavigationSidebar: React.FC = () => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const workspace = useActiveWorkspace();
  const workspaceID = workspace?.id;

  const isOwner = usePermission(Permission.EDIT_ORGANIZATION);
  const isAdmin = usePermission(Permission.CONFIGURE_WORKSPACE);

  return (
    <NavigationSidebar isMainMenu>
      <S.SidebarActionsContainer>
        <Box.Flex style={{ width: '100%' }} flexDirection="column" alignItems="flex-start" gap={17}>
          <WorkspaceSelector activeWorkspace={workspace} />

          <S.SidebarGroup>
            <NavigationSidebar.NavItem icon="goToBlock" title="Assistants" exact to={generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID })} />
            <NavigationSidebar.NavItem
              icon="team"
              title={isAdmin ? 'Team & Billing' : 'Team'}
              rightText={workspace?.members.length.toString()}
              to={generatePath(Path.WORKSPACE_TEAM_AND_BILLING, { workspaceID })}
            />
          </S.SidebarGroup>
          <S.SidebarGroup>
            <NavigationSidebar.Item icon="video" title="Learn" link="https://www.voiceflow.com/docs" />
            <NavigationSidebar.Item icon="publish" title="Templates" link="https://www.voiceflow.com/templates" />
            <NavigationSidebar.Item icon="whatsNew" title="What's New" link="https://www.voiceflow.com/blog" />
          </S.SidebarGroup>
          <S.SidebarGroup>
            <NavigationSidebar.Item icon="noMatch" title="Get Help" />
            {isAdmin && <NavigationSidebar.Item icon="systemSettings" title="Settings" />}
            {isOwner && <NavigationSidebar.Item icon="organization" title="Organization" />}
          </S.SidebarGroup>
        </Box.Flex>

        <Box.Flex style={{ width: '100%' }} flexDirection="column" alignItems="flex-start" gap={24} paddingBottom="16px">
          <S.SidebarGroup>
            {plan === PlanType.STARTER && <NavigationSidebar.Item icon="paid" title="Upgrade to Pro" />}
            <NavigationSidebar.Item icon="sales" title="Contact Sales" />
          </S.SidebarGroup>
        </Box.Flex>
      </S.SidebarActionsContainer>
      <Account />
    </NavigationSidebar>
  );
};

export default DashboardNavigationSidebar;
