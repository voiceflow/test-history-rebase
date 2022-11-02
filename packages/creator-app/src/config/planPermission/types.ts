import type { PlanType } from '@voiceflow/internal';
import React from 'react';

import type { UpgradePopperData } from '@/components/UpgradePopper';
import type { UpgradeTooltipData } from '@/components/UpgradeTooltip';
import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';

type ConditionalGetter<Data, Return> = Data extends {} ? (data: Data) => Return : () => Return;

export interface ToastErrorPermission<Data = {}> {
  getToastError: ConditionalGetter<Data, React.ReactNode>;
}

export interface UpgradeModalPermission<Data> {
  getUpgradeModal: ConditionalGetter<Data, UpgradeModal>;
}

export interface UpgradePopperPermission<Data> {
  getUpgradePopper: ConditionalGetter<Data, UpgradePopperData>;
}

export interface UpgradeTooltipPermission<Data> {
  getUpgradeTooltip: ConditionalGetter<Data, UpgradeTooltipData>;
}

export interface UpgradePopperAndTooltipPermission<Data> extends UpgradePopperPermission<Data>, UpgradeTooltipPermission<Data> {}

export type AnyPermission<Data> =
  | ToastErrorPermission<Data>
  | UpgradeModalPermission<Data>
  | UpgradePopperPermission<Data>
  | UpgradeTooltipPermission<Data>
  | UpgradePopperAndTooltipPermission<Data>;

export type PlanPermission<Permission> = Partial<Record<PlanType, Permission>>;
