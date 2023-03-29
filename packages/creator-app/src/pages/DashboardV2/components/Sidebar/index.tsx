import { PlanType } from '@voiceflow/internal';
import { System } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Path } from '@/config/routes';
import { BOOK_DEMO_LINK, CHANGELOG_LINK, DISCORD_LINK, GET_HELP, LEARN, PLAN_TYPE_META, TEMPLATES_LINK } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Sessions from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import * as ModalsV2 from '@/ModalsV2';

import { Account as AccountComponent } from './components';
import * as S from './styles';

const getPlanName = (plan: PlanType) => PLAN_TYPE_META[plan]?.label?.replace('Starter', 'Free').replace('Team', 'Pro');

const DashboardNavigationSidebar: React.FC = () => {
  const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const workspaceID = useSelector(Sessions.activeWorkspaceIDSelector) ?? 'unknown';
  const membersCount = useSelector(WorkspaceV2.active.allNormalizedMembersCountSelector);
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector) ?? 'unknown';

  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);
  const [, trackEventFactory] = useTrackingEvents();

  const [canConfigureSSO] = usePermission(Permission.ORGANIZATION_CONFIGURE_SSO, { organizationAdmin: true });
  const [canManageOrgMembers] = usePermission(Permission.ORGANIZATION_MANAGE_MEMBERS, { organizationAdmin: true });
  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);

  const canUpgradeToPro = !isPaidPlan && canConfigureWorkspace;

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
          <System.Link.Anchor
            href={LEARN}
            color={System.Link.Color.INHERIT}
            onClick={trackEventFactory(null, 'trackDashboardLinkClicked', { linkType: 'Learn' })}
          >
            <NavigationSidebar.Item icon="video" title="Learn">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </System.Link.Anchor>

          <System.Link.Anchor
            href={TEMPLATES_LINK}
            color={System.Link.Color.INHERIT}
            onClick={trackEventFactory(null, 'trackDashboardLinkClicked', { linkType: 'Templates' })}
          >
            <NavigationSidebar.Item icon="publish" title="Templates">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </System.Link.Anchor>

          <System.Link.Anchor
            href={CHANGELOG_LINK}
            color={System.Link.Color.INHERIT}
            onClick={trackEventFactory(null, 'trackDashboardLinkClicked', { linkType: "What's New" })}
          >
            <NavigationSidebar.Item icon="whatsNew" title="What's New">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </System.Link.Anchor>

          <System.Link.Anchor
            href={DISCORD_LINK}
            color={System.Link.Color.INHERIT}
            onClick={trackEventFactory(null, 'trackDashboardLinkClicked', { linkType: 'Discord' })}
          >
            <NavigationSidebar.Item icon="discord" title="Discord">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </System.Link.Anchor>
        </S.Group>

        <S.Group>
          <System.Link.Anchor
            href={GET_HELP}
            color={System.Link.Color.INHERIT}
            onClick={trackEventFactory(null, 'trackDashboardLinkClicked', { linkType: 'Get Help' })}
          >
            <NavigationSidebar.Item icon="noMatch" title="Get Help">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </System.Link.Anchor>

          {canConfigureWorkspace && (
            <NavigationSidebar.NavItem
              to={generatePath(Path.WORKSPACE_SETTINGS, { workspaceID })}
              icon="systemSettings"
              title="Settings"
              isActive={({ pathname, matchPath }) => !!matchPath(pathname, { path: Path.WORKSPACE_SETTINGS })}
            />
          )}

          {(canConfigureSSO || canManageOrgMembers) && (
            <NavigationSidebar.NavItem
              to={generatePath(Path.WORKSPACE_ORGANIZATION, { workspaceID, organizationID })}
              icon="organization"
              title="Organization"
              isActive={({ pathname, matchPath }) => !!matchPath(pathname, { path: Path.WORKSPACE_ORGANIZATION })}
            />
          )}
        </S.Group>

        <S.FillSpace />

        <S.Group>
          <NavigationSidebar.Item
            icon="paid"
            title={canUpgradeToPro ? 'Upgrade to Pro' : `Plan: ${getPlanName(plan!)}`}
            disabled={!canUpgradeToPro}
            onClick={() => paymentModal.open({})}
          />

          <System.Link.Anchor
            href={BOOK_DEMO_LINK}
            color={System.Link.Color.INHERIT}
            onClick={trackEventFactory(null, 'trackDashboardLinkClicked', { linkType: 'Contact Sales' })}
          >
            <NavigationSidebar.Item icon="sales" title="Contact Sales">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </System.Link.Anchor>
        </S.Group>
      </S.GroupsContainer>

      <AccountComponent />
    </NavigationSidebar>
  );
};

export default DashboardNavigationSidebar;
