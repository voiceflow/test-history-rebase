import * as Realtime from '@voiceflow/realtime-sdk';

import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';

import { useFeature } from './feature.hook';
import { usePermission } from './permission';

export const useOrganizationSSOPagePath = () => {
  const [canConfigureSSO] = usePermission(Permission.ORGANIZATION_CONFIGURE_SSO);
  const disableSSOConfigurationPage = useFeature(Realtime.FeatureFlag.DISABLE_SSO_CONFIGURATION_PAGE);

  return canConfigureSSO && !disableSSOConfigurationPage ? Path.WORKSPACE_ORGANIZATION_SSO : null;
};

export const useOrganizationMembersPagePath = () => {
  const orgMembers = useFeature(Realtime.FeatureFlag.ORGANIZATION_MEMBERS);
  const [canManageOrgMembers] = usePermission(Permission.ORGANIZATION_MANAGE_MEMBERS);

  return canManageOrgMembers && orgMembers ? Path.WORKSPACE_ORGANIZATION_MEMBERS : null;
};

export const useOrganizationSettingsPagePath = () => {
  const orgSettings = useFeature(Realtime.FeatureFlag.ORG_GENERAL_SETTINGS);
  const [canConfigureOrganization] = usePermission(Permission.ORGANIZATION_UPDATE);

  return canConfigureOrganization && orgSettings ? Path.WORKSPACE_ORGANIZATION_SETTINGS : null;
};

export const useOrganizationDefaultPagePath = () => {
  const ssoPagePath = useOrganizationSSOPagePath();
  const membersPagePath = useOrganizationMembersPagePath();
  const settingsPagePath = useOrganizationSettingsPagePath();

  // ORDER MATTERS
  return settingsPagePath || membersPagePath || ssoPagePath;
};
