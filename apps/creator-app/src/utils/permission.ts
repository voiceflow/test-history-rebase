import { Nullish } from '@voiceflow/common';

import {
  Permission,
  PLAN_PERMISSION_DEFAULT_WARN_MESSAGE,
  ROLE_PERMISSION_DEFAULT_WARN_MESSAGE,
  TRIAL_EXPIRED_PERMISSION_DEFAULT_WARN_MESSAGE,
} from '@/constants/permissions';
import type { Identity } from '@/hooks/identity';

import { hasPlanPermission, verifyPlanPermissionConfig } from './planPermission';
import { getRolePermissionConfig, hasRolePermission, verifyRolePermissionConfig } from './rolePermission';

export const getPermission = <P extends Permission>(permission: Nullish<P>, identity: Identity) => {
  const rolePermissionConfig = permission ? getRolePermissionConfig(permission) : null;

  const { activePlan } = identity;
  const activeRole = rolePermissionConfig?.ignoreProjectIdentity ? identity.workspaceActiveRole : identity.activeRole;

  const planAllowed = !permission || (!!activePlan && hasPlanPermission(permission, activePlan));
  const roleAllowed = !permission || (!!activeRole && hasRolePermission(permission, activeRole));
  const trialAllowed = !permission || !identity.organizationTrialExpired;

  return {
    allowed: planAllowed && roleAllowed && trialAllowed,
    roleConfig: permission && activeRole ? verifyRolePermissionConfig<P>(permission, activeRole) : null,
    planConfig: permission && activePlan ? verifyPlanPermissionConfig<P>(permission, activePlan) : null,
    roleAllowed,
    planAllowed,
    trialAllowed,
  };
};

export type PermissionConfig<P extends Permission> = ReturnType<typeof getPermission<P>>;

export const getDefaultWarnMessage = (config: PermissionConfig<Permission>): null | string => {
  if (config.allowed) return null;

  if (!config.planAllowed) return PLAN_PERMISSION_DEFAULT_WARN_MESSAGE;
  if (!config.roleAllowed) return ROLE_PERMISSION_DEFAULT_WARN_MESSAGE;
  if (!config.trialAllowed) return TRIAL_EXPIRED_PERMISSION_DEFAULT_WARN_MESSAGE;

  return null;
};
