import type { PlanType } from '@voiceflow/internal';
import React from 'react';

import { LimitType } from '@/constants/limits';
import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';

interface RendererProps {
  limit: number;
  increasableLimit?: number;
}

export interface BaseStaticLimit {
  limit: number;
}

export type ErrorRenderer = (props: RendererProps) => React.ReactNode;

export interface ToastErrorDynamicLimit {
  toastError: ErrorRenderer;
  increasableLimit?: number;
}

export interface ToastErrorStaticLimit extends BaseStaticLimit, ToastErrorDynamicLimit {}

export interface UpgradeModalDynamicLimit {
  upgradeModal: (props: RendererProps) => UpgradeModal;
  increasableLimit?: number;
}

export interface UpgradeModalStaticLimit extends BaseStaticLimit, UpgradeModalDynamicLimit {}

export type AnyLimit = ToastErrorStaticLimit | ToastErrorDynamicLimit | UpgradeModalStaticLimit | UpgradeModalDynamicLimit;

export interface PlanLimit {
  limit: LimitType;
  limits: Partial<Record<PlanType, AnyLimit>>;
}
