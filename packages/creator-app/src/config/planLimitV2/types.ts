import type { PlanType } from '@voiceflow/internal';
import React from 'react';

import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';

interface RendererProps {
  limit: number;
}

interface BaseValueLimit {
  value: number;
}

export interface ToastErrorDynamicLimit {
  getToastError: (props: RendererProps) => React.ReactNode;
}

export interface ToastErrorValueLimit extends ToastErrorDynamicLimit, BaseValueLimit {}

export interface UpgradeModalDynamicLimit {
  getUpgradeModal: (props: RendererProps) => UpgradeModal;
}

export interface UpgradeModalValueLimit extends UpgradeModalDynamicLimit, BaseValueLimit {}

export type PlanLimit<Limit> = Partial<Record<PlanType, Limit>>;
