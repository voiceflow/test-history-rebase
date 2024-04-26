import type { PlanType } from '@voiceflow/internal';
import type React from 'react';

import type { UpgradePopperData } from '@/components/UpgradePopper';
import type { UpgradeTooltipData } from '@/components/UpgradeTooltip';
import type { Permission } from '@/constants/permissions';
import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';

export type ActionGetter<Data, Return> = Data extends {} ? (data: Data) => Return : () => Return;

export interface BasePlanPermission {
  plans: ReadonlyArray<PlanType>;
  permission: Permission;
}

export interface ToastErrorPlanPermission<Data = void> extends BasePlanPermission {
  toastError: ActionGetter<Data, React.ReactNode>;
}

export interface UpgradeModalPlanPermission<Data = void> extends BasePlanPermission {
  upgradeModal: ActionGetter<Data, UpgradeModal>;
}

export interface UpgradePopperPlanPermission<Data = void> extends BasePlanPermission {
  upgradePopper: ActionGetter<Data, UpgradePopperData>;
}

export interface UpgradeTooltipPlanPermission<Data = void> extends BasePlanPermission {
  upgradeTooltip: ActionGetter<Data, UpgradeTooltipData>;
}

export interface UpgradePopperAndTooltipPlanPermission<Data = void>
  extends BasePlanPermission,
    UpgradePopperPlanPermission<Data>,
    UpgradeTooltipPlanPermission<Data> {}

export interface UpgradeModalAndTooltipPlanPermission<Data = void>
  extends BasePlanPermission,
    UpgradeModalPlanPermission<Data>,
    UpgradeTooltipPlanPermission<Data> {}

export type AnyPlanPermission<Data> =
  | BasePlanPermission
  | ToastErrorPlanPermission<Data>
  | UpgradeModalPlanPermission<Data>
  | UpgradePopperPlanPermission<Data>
  | UpgradeTooltipPlanPermission<Data>
  | UpgradePopperAndTooltipPlanPermission<Data>;
