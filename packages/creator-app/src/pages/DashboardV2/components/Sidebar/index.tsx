import { PlanType } from '@voiceflow/internal';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, usePermission, useSelector } from '@/hooks';

import { Account, SidebarItem } from './components';
import * as S from './styles';

const Sidebar: React.FC = () => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const workspace = useActiveWorkspace();

  const isOwner = usePermission(Permission.EDIT_ORGANIZATION);
  const isAdmin = usePermission(Permission.CONFIGURE_WORKSPACE);

  return (
    <S.SidebarWrapper>
      <S.SidebarActionsContainer>
        <Box style={{ width: '100%' }} flexDirection="column" alignItems="flex-start" display="flex">
          <S.SidebarGroup>
            <SidebarItem icon="carousel" label="Assistants" active />
            <SidebarItem icon="team" label={isAdmin ? 'Team & Billing' : 'Team'} detail={workspace?.members.length.toString()} />
          </S.SidebarGroup>
          <S.SidebarGroup>
            <SidebarItem icon="video" label="Learn" link="https://www.voiceflow.com/docs" />
            <SidebarItem icon="publish" label="Templates" link="https://www.voiceflow.com/templates" />
            <SidebarItem icon="whatsNew" label="What's New" link="https://www.voiceflow.com/blog" />
          </S.SidebarGroup>
          <S.SidebarGroup>
            <SidebarItem icon="noMatch" label="Get Help" />
            {isAdmin && <SidebarItem icon="systemSettings" label="Settings" />}
            {isOwner && <SidebarItem icon="organization" label="Organization" />}
          </S.SidebarGroup>
        </Box>
        <Box style={{ width: '100%' }} flexDirection="column" alignItems="flex-start" display="flex">
          <S.SidebarGroup>
            {plan === PlanType.STARTER && <SidebarItem icon="paid" label="Upgrade to Pro" />}
            <SidebarItem icon="sales" label="Contact Sales" />
          </S.SidebarGroup>
        </Box>
      </S.SidebarActionsContainer>
      <Account />
    </S.SidebarWrapper>
  );
};

export default Sidebar;
