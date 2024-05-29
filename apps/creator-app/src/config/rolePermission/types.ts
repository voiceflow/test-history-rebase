import type { UserRole } from '@voiceflow/dtos';
import React from 'react';

import type { UpgradePopperData } from '@/components/UpgradePopper';
import type { UpgradeTooltipData } from '@/components/UpgradeTooltip';
import type { Permission } from '@/constants/permissions';
import type { VirtualRole } from '@/constants/roles';
import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';

export type ActionGetter<Data, Return> = Data extends object ? (data: Data) => Return : () => Return;

export interface BaseRolePermission {
  roles: ReadonlyArray<UserRole | VirtualRole>;
  permission: Permission;
  ignoreProjectIdentity?: boolean;
}

export interface ToastErrorRolePermission<Data = void> extends BaseRolePermission {
  toastError: ActionGetter<Data, React.ReactNode>;
}

export interface UpgradeModalRolePermission<Data = void> extends BaseRolePermission {
  upgradeModal: ActionGetter<Data, UpgradeModal>;
}

export interface UpgradePopperRolePermission<Data = void> extends BaseRolePermission {
  upgradePopper: ActionGetter<Data, UpgradePopperData>;
}

export interface UpgradeTooltipRolePermission<Data = void> extends BaseRolePermission {
  upgradeTooltip: ActionGetter<Data, UpgradeTooltipData>;
}

export interface UpgradePopperAndTooltipRolePermission<Data = void>
  extends BaseRolePermission,
    UpgradePopperRolePermission<Data>,
    UpgradeTooltipRolePermission<Data> {}

export type AnyRolePermission<Data> =
  | BaseRolePermission
  | ToastErrorRolePermission<Data>
  | UpgradeModalRolePermission<Data>
  | UpgradePopperRolePermission<Data>
  | UpgradeTooltipRolePermission<Data>
  | UpgradePopperAndTooltipRolePermission<Data>;
