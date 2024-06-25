import type { PlanType } from '@voiceflow/internal';
import type React from 'react';

import type { LimitType } from '@/constants/limits';
import type { State } from '@/ducks';
import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';

interface RendererProps {
  limit: number;
  maxLimit?: number;
}

export interface BaseStaticLimit {
  limit: number;
}

export type ErrorRenderer = (props: RendererProps) => React.ReactNode;

export interface ToastErrorDynamicLimit {
  toastError: ErrorRenderer;
  maxLimitSelector?: (state: State) => number;
}

export interface ToastErrorStaticLimit extends BaseStaticLimit, ToastErrorDynamicLimit {}

export interface UpgradeModalDynamicLimit {
  upgradeModal: (props: RendererProps) => UpgradeModal;
  maxLimitSelector?: (state: State) => number;
}

export interface UpgradeModalStaticLimit extends BaseStaticLimit, UpgradeModalDynamicLimit {}

export type AnyLimit =
  | ToastErrorStaticLimit
  | ToastErrorDynamicLimit
  | UpgradeModalStaticLimit
  | UpgradeModalDynamicLimit;

export interface PlanLimit {
  limit: LimitType;
  limits: Partial<Record<PlanType, AnyLimit>>;
}
