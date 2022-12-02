import { PlanType } from '@voiceflow/internal';
import { Link } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, usePermission, useSelector } from '@/hooks';

import { Account } from './components';
import * as S from './styles';

const DashboardNavigationSidebar: React.FC = () => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const workspace = useActiveWorkspace();
  const workspaceID = workspace?.id;

  const isOwner = usePermission(Permission.EDIT_ORGANIZATION);
  const isAdmin = usePermission(Permission.CONFIGURE_WORKSPACE);

  return (
    <NavigationSidebar isMainMenu>
      <S.GroupsContainer>
        <S.Group>
          <NavigationSidebar.NavItem to={generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID })} icon="goToBlock" title="Assistants" exact />

          <NavigationSidebar.NavItem
            to={generatePath(Path.WORKSPACE_MEMBERS, { workspaceID })}
            icon="team"
            title={isAdmin ? 'Team & Billing' : 'Team'}
            isActive={({ pathname, matchPath }) => !!matchPath(pathname, { path: [Path.WORKSPACE_MEMBERS, Path.WORKSPACE_BILLING] })}
          >
            <NavigationSidebar.Item.SubText>{workspace?.members.length.toString()}</NavigationSidebar.Item.SubText>
          </NavigationSidebar.NavItem>
        </S.Group>

        <S.Group>
          <Link color="inherit" href="https://www.voiceflow.com/docs">
            <NavigationSidebar.Item icon="video" title="Learn">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>

          <Link color="inherit" href="https://www.voiceflow.com/templates">
            <NavigationSidebar.Item icon="publish" title="Templates">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>

          <Link color="inherit" link="https://www.voiceflow.com/blog">
            <NavigationSidebar.Item icon="whatsNew" title="What's New">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>
        </S.Group>

        <S.Group>
          <NavigationSidebar.Item icon="noMatch" title="Get Help" />

          {isAdmin && <NavigationSidebar.Item icon="systemSettings" title="Settings" />}

          {isOwner && <NavigationSidebar.Item icon="organization" title="Organization" />}
        </S.Group>

        <S.FillSpace />

        <S.Group>
          {plan === PlanType.STARTER && <NavigationSidebar.Item icon="paid" title="Upgrade to Pro" />}
          <NavigationSidebar.Item icon="sales" title="Contact Sales" />
        </S.Group>
      </S.GroupsContainer>

      <Account />
    </NavigationSidebar>
  );
};

export default DashboardNavigationSidebar;
