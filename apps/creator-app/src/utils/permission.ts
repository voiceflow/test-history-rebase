import { Nullish } from '@voiceflow/common';
import { PlanType, UserRole } from '@voiceflow/internal';

import {
  Permission,
  PLAN_PERMISSION_DEFAULT_WARN_MESSAGE,
  ROLE_PERMISSION_DEFAULT_WARN_MESSAGE,
  TRIAL_EXPIRED_PERMISSION_DEFAULT_WARN_MESSAGE,
} from '@/constants/permissions';
import { VirtualRole } from '@/constants/roles';

import { getPlanPermissionConfig, hasPlanPermission } from './planPermission';
import { getRolePermissionConfig, hasRolePermission } from './rolePermission';

export const hasPermission = <P extends Permission>({
  role,
  plan,
  permission,
  organizationTrialExpired,
}: {
  role: Nullish<UserRole | VirtualRole>;
  plan: Nullish<PlanType>;
  permission: Nullish<P>;
  organizationTrialExpired?: boolean | null;
}) => {
  const planAllowed = !permission || (!!plan && hasPlanPermission(permission, plan));
  const roleAllowed = !permission || (!!role && hasRolePermission(permission, role));
  const trialAllowed = !permission || !organizationTrialExpired;

  return {
    allowed: planAllowed && roleAllowed && trialAllowed,
    roleConfig: permission && role ? getRolePermissionConfig<P>(permission, role) : null,
    planConfig: permission && plan ? getPlanPermissionConfig<P>(permission, plan) : null,
    roleAllowed,
    planAllowed,
    trialAllowed,
  };
};

export type PermissionConfig<P extends Permission> = ReturnType<typeof hasPermission<P>>;

export const getDefaultWarnMessage = (config: PermissionConfig<Permission>): null | string => {
  if (config.allowed) return null;

  if (!config.planAllowed) return PLAN_PERMISSION_DEFAULT_WARN_MESSAGE;
  if (!config.roleAllowed) return ROLE_PERMISSION_DEFAULT_WARN_MESSAGE;
  if (!config.trialAllowed) return TRIAL_EXPIRED_PERMISSION_DEFAULT_WARN_MESSAGE;

  return null;
};
