import { PlanType } from '@voiceflow/internal';
import { Link } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import { BLOG_LINK, BOOK_DEMO_LINK, DOCS_LINK, TEMPLATES_LINK, YOUTUBE_CHANNEL_LINK } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import { useActiveWorkspace } from '@/hooks/workspace';

import { Account } from './components';
import * as S from './styles';

const DashboardNavigationSidebar: React.OldFC = () => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const workspace = useActiveWorkspace();
  const workspaceID = workspace?.id ?? 'unknown';

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
            <NavigationSidebar.Item.SubText>{workspace?.members.length}</NavigationSidebar.Item.SubText>
          </NavigationSidebar.NavItem>
        </S.Group>

        <S.Group>
          <Link color="inherit" href={YOUTUBE_CHANNEL_LINK}>
            <NavigationSidebar.Item icon="video" title="Learn">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>

          <Link color="inherit" href={TEMPLATES_LINK}>
            <NavigationSidebar.Item icon="publish" title="Templates">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>

          <Link color="inherit" link={BLOG_LINK}>
            <NavigationSidebar.Item icon="whatsNew" title="What's New">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>
        </S.Group>

        <S.Group>
          <Link color="inherit" link={DOCS_LINK}>
            <NavigationSidebar.Item icon="noMatch" title="Get Help">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>

          {isAdmin && <NavigationSidebar.Item icon="systemSettings" title="Settings" />}

          {isOwner && (
            <NavigationSidebar.NavItem
              to={generatePath(Path.WORKSPACE_GENERAL_ORG, { workspaceID })}
              icon="organization"
              title="Organization"
              isActive={({ pathname, matchPath }) =>
                !!matchPath(pathname, { path: [Path.WORKSPACE_GENERAL_ORG, Path.WORKSPACE_MEMBERS_ORG, Path.WORKSPACE_SSO_ORG] })
              }
            />
          )}
        </S.Group>

        <S.FillSpace />

        <S.Group>
          {plan === PlanType.STARTER && <NavigationSidebar.Item icon="paid" title="Upgrade to Pro" />}
          <Link color="inherit" href={BOOK_DEMO_LINK}>
            <NavigationSidebar.Item icon="sales" title="Contact Sales">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>
        </S.Group>
      </S.GroupsContainer>

      <Account />
    </NavigationSidebar>
  );
};

export default DashboardNavigationSidebar;
