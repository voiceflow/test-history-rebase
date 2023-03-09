import { Link } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Path } from '@/config/routes';
import { BOOK_DEMO_LINK, CHANGELOG_LINK, GET_HELP, LEARN, TEMPLATES_LINK } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import * as Sessions from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import * as ModalsV2 from '@/ModalsV2';
import { openURLInANewTab } from '@/utils/window';

import { Account as AccountComponent } from './components';
import * as S from './styles';

const DashboardNavigationSidebar: React.FC = () => {
  const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const workspaceID = useSelector(Sessions.activeWorkspaceIDSelector) ?? 'unknown';
  const membersCount = useSelector(WorkspaceV2.active.allNormalizedMembersCountSelector);
  const user = useSelector(Account.userSelector);

  const [canEditOrganization] = usePermission(Permission.EDIT_ORGANIZATION);
  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);
  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);

  return (
    <NavigationSidebar isMainMenu>
      <S.GroupsContainer>
        <S.Group>
          <NavigationSidebar.NavItem to={generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID })} icon="goToBlock" title="Assistants" exact />

          <NavigationSidebar.NavItem
            to={generatePath(Path.WORKSPACE_MEMBERS, { workspaceID })}
            icon="team"
            title={canConfigureWorkspace ? 'Team & Billing' : 'Team'}
            isActive={({ pathname, matchPath }) => !!matchPath(pathname, { path: [Path.WORKSPACE_MEMBERS, Path.WORKSPACE_BILLING] })}
          >
            <NavigationSidebar.Item.SubText>{membersCount}</NavigationSidebar.Item.SubText>
          </NavigationSidebar.NavItem>
        </S.Group>

        <S.Group>
          <Link color="inherit" href={LEARN}>
            <NavigationSidebar.Item icon="video" title="Learn">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>

          <Link color="inherit" href={TEMPLATES_LINK}>
            <NavigationSidebar.Item icon="publish" title="Templates">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>

          <Link color="inherit" link={CHANGELOG_LINK}>
            <NavigationSidebar.Item icon="whatsNew" title="What's New">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>
        </S.Group>

        <S.Group>
          <Link color="inherit" onClick={() => openURLInANewTab(GET_HELP)}>
            <NavigationSidebar.Item icon="noMatch" title="Get Help">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>

          {canConfigureWorkspace && (
            <NavigationSidebar.NavItem
              to={generatePath(Path.WORKSPACE_SETTINGS, { workspaceID })}
              icon="systemSettings"
              title="Settings"
              isActive={({ pathname, matchPath }) => !!matchPath(pathname, { path: [Path.WORKSPACE_SETTINGS] })}
            />
          )}

          {canEditOrganization && user.isSSO && (
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
          {!isPaidPlan && canConfigureWorkspace && (
            <NavigationSidebar.Item icon="paid" title="Upgrade to Pro" onClick={() => paymentModal.open({})} />
          )}

          <Link color="inherit" href={BOOK_DEMO_LINK}>
            <NavigationSidebar.Item icon="sales" title="Contact Sales">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </Link>
        </S.Group>
      </S.GroupsContainer>

      <AccountComponent />
    </NavigationSidebar>
  );
};

export default DashboardNavigationSidebar;
