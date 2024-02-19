import { PlanType } from '@voiceflow/internal';
import { Box, System } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavigationSidebar from '@/components/NavigationSidebar';
import TrialCountdownCard from '@/components/TrialCountdownCard';
import { Path } from '@/config/routes';
import { BOOK_DEMO_LINK, CHANGELOG_LINK, DISCORD_LINK, GET_HELP_LINK, LEARN_LINK, TEMPLATES_LINK } from '@/constants/link.constant';
import { Permission } from '@/constants/permissions';
import * as Sessions from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useOrganizationDefaultPagePath } from '@/hooks/organization';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import * as ModalsV2 from '@/ModalsV2';
import { getPlanTypeLabel } from '@/utils/plans';

import { Account as AccountComponent } from './components';
import * as S from './styles';

const DashboardNavigationSidebar: React.FC = () => {
  const plan = useSelector(WorkspaceV2.active.planSelector) ?? PlanType.STARTER;
  const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const workspaceID = useSelector(Sessions.activeWorkspaceIDSelector) ?? 'unknown';
  const membersCount = useSelector(WorkspaceV2.active.allNormalizedMembersCountSelector);
  const isProWorkspace = useSelector(WorkspaceV2.active.isProSelector);
  const isEnterpriseWorkspace = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const organizationTrialDaysLeft = useSelector(WorkspaceV2.active.organizationTrialDaysLeftSelector);

  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);
  const [, trackEventFactory] = useTrackingEvents();
  const organizationDefaultPagePath = useOrganizationDefaultPagePath();

  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);

  const isProTrial = isProWorkspace && organizationTrialDaysLeft !== null;
  const canUpgradeToPro = (!isPaidPlan || isProTrial) && canConfigureWorkspace;

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
            href={LEARN_LINK}
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
            <NavigationSidebar.Item icon="discord" title="Discord Community">
              <NavigationSidebar.Item.LinkIcon />
            </NavigationSidebar.Item>
          </System.Link.Anchor>
        </S.Group>

        <S.Group>
          <System.Link.Anchor
            href={GET_HELP_LINK}
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

          {organizationDefaultPagePath && (
            <NavigationSidebar.NavItem
              to={generatePath(organizationDefaultPagePath, { workspaceID })}
              icon="organization"
              title="Organization"
              isActive={({ pathname, matchPath }) =>
                !!matchPath(pathname, {
                  path: [Path.WORKSPACE_ORGANIZATION_SETTINGS, Path.WORKSPACE_ORGANIZATION_MEMBERS, Path.WORKSPACE_ORGANIZATION_SSO],
                })
              }
            />
          )}
        </S.Group>

        <S.FillSpace />

        <S.Group>
          {(isEnterpriseWorkspace || isProWorkspace) && organizationTrialDaysLeft !== null ? (
            <Box mb={12} width="100%">
              <TrialCountdownCard
                isProTrial={!!isProTrial}
                daysLeft={organizationTrialDaysLeft}
                onClick={canUpgradeToPro ? () => paymentModal.open({}) : undefined}
              />
            </Box>
          ) : (
            <NavigationSidebar.Item
              icon="paid"
              title={canUpgradeToPro ? 'Upgrade to Pro' : `Plan: ${getPlanTypeLabel(plan)}`}
              onClick={() => paymentModal.open({})}
              disabled={!canUpgradeToPro}
            />
          )}

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
