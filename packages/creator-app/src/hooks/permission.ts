import { PlanType } from '@voiceflow/internal';
import { toast } from '@voiceflow/ui';
import React from 'react';

import {
  Permission,
  PLAN_PERMISSION_DEFAULT_WARN_MESSAGE,
  ROLE_PERMISSION_DEFAULT_WARN_MESSAGE,
  TRIAL_EXPIRED_PERMISSION_DEFAULT_WARN_MESSAGE,
} from '@/constants/permissions';
import { VirtualRole } from '@/constants/roles';
import { hasPermission, PermissionConfig } from '@/utils/permission';

import { Identity, IdentityOptions, useIdentity } from './identity';

export const checkPermission = <P extends Permission>(identity: Identity, permission?: P | null) => ({
  ...identity,
  ...hasPermission<P>({
    role: identity.activeRole,
    plan: identity.activePlan,
    permission,
    organizationTrialExpired: identity.organizationTrialExpired,
  }),
});

export const usePermission = <P extends Permission>(permission?: P | null, options?: IdentityOptions) => {
  const identity = useIdentity(options);

  return React.useMemo(() => {
    const permissionCheck = checkPermission<P>(identity, permission);

    return Object.assign([permissionCheck.allowed, identity] as const, permissionCheck);
  }, [identity, permission]);
};

export const useIsPreviewer = (options?: IdentityOptions) => {
  const identity = useIdentity(options);

  return identity.activeRole === VirtualRole.PREVIEWER;
};

export const useIsLockedProjectViewer = (options?: IdentityOptions) => {
  const identity = useIdentity(options);

  return identity.activeRole === VirtualRole.LOCKED_PROJECT_VIEWER;
};

export const useGetPermission = (options?: IdentityOptions) => {
  const identity = useIdentity(options);

  return React.useCallback(<P extends Permission>(permission?: P | null) => checkPermission<P>(identity, permission), [identity]);
};

export const useHasPermissions = (permissions: Permission[], options?: IdentityOptions): boolean => {
  const identity = useIdentity(options);

  return React.useMemo(() => permissions.every((permission) => checkPermission(identity, permission).allowed), [identity, ...permissions]);
};

export const useGuestPermission = <P extends Permission>(activePlan: PlanType, permission?: P | null) =>
  React.useMemo(() => {
    const permissionCheck = checkPermission<P>(
      { activeRole: VirtualRole.GUEST, activePlan, organizationRole: null, organizationTrialExpired: null },
      permission
    );

    return Object.assign([permissionCheck.allowed] as const, permissionCheck);
  }, [permission]);

export const useIsCanvasDesignOnly = () => {
  const editProjectPermission = usePermission(Permission.PROJECT_EDIT);
  const viewConversationsPermission = usePermission(Permission.VIEW_CONVERSATIONS);

  return !editProjectPermission.allowed && !viewConversationsPermission.allowed;
};

interface PermissionActionOptions<P extends Permission, Args extends any[] = []> extends IdentityOptions {
  /**
   * the callback is called if user has the permission
   */
  onAction: (...args: Args) => void;

  /**
   * additional custom check for permission
   */
  isAllowed?: (options: PermissionConfig<P> & { args: Args }) => void;

  /**
   * the callback is called if workspace's plan doesn't have the permission
   */
  onPlanForbid?: (options: PermissionConfig<P> & { args: Args; planConfig: NonNullable<PermissionConfig<P>['planConfig']> }) => void;

  /**
   * the callback is called if user's role doesn't have the permission
   */
  onRoleForbid?: (options: PermissionConfig<P> & { args: Args; roleConfig: NonNullable<PermissionConfig<P>['roleConfig']> }) => void;

  /**
   * the callback is called if trial expired and workspace's plan doesn't have the permission
   * shows warn toast by default
   */
  onDefaultTrialForbid?: (options: PermissionConfig<P> & { args: Args }) => void;

  /**
   * the callback is called if workspace's plan doesn't have the permission and plan config is not defined or `onPlanForbid` is not provided,
   * shows warn toast by default
   */
  onDefaultPlanForbid?: (options: PermissionConfig<P> & { args: Args }) => void;

  /**
   * the callback is called if user's role doesn't have the permission and plan config is not defined or `onRoleForbid` is not provided,
   * shows warn toast by default
   */
  onDefaultRoleForbid?: (options: PermissionConfig<P> & { args: Args }) => void;
}

export const usePermissionAction = <P extends Permission, Args extends any[] = []>(
  permission: P,
  {
    onAction,
    isAllowed,
    onPlanForbid,
    onRoleForbid,
    onDefaultPlanForbid = () => toast.warn(PLAN_PERMISSION_DEFAULT_WARN_MESSAGE),
    onDefaultRoleForbid = () => toast.warn(ROLE_PERMISSION_DEFAULT_WARN_MESSAGE),
    onDefaultTrialForbid = () => toast.warn(TRIAL_EXPIRED_PERMISSION_DEFAULT_WARN_MESSAGE),
    ...options
  }: PermissionActionOptions<P, Args>
): ((...args: Args) => void) => {
  const getPermission = useGetPermission(options);

  return (...args: Args) => {
    const config = getPermission(permission);

    if (config.allowed || isAllowed?.({ ...config, args })) {
      onAction(...args);
    } else if (!config.planAllowed) {
      if (onPlanForbid && config.planConfig) {
        onPlanForbid({ ...config, args, planConfig: config.planConfig });
      } else {
        onDefaultPlanForbid({ ...config, args });
      }
    } else if (!config.roleAllowed) {
      if (onRoleForbid && config.roleConfig) {
        onRoleForbid({ ...config, args, roleConfig: config.roleConfig });
      } else {
        onDefaultRoleForbid({ ...config, args });
      }
    } else if (config.trialAllowed) {
      onDefaultTrialForbid({ ...config, args });
    }
  };
};
