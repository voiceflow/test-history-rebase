import type { PlanType } from '@voiceflow/internal';
import React from 'react';

import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';

interface RendererProps {
  limit: number;
  increasableLimit?: number;
}

export interface BaseLimit {
  limit: number;
}

export type ErrorRenderer = (props: RendererProps) => React.ReactNode;

export interface ToastErrorDynamicLimit {
  getToastError: ErrorRenderer;
  increasableLimit?: number;
}

export interface ToastErrorStaticLimit extends BaseLimit, ToastErrorDynamicLimit {}

export interface UpgradeModalDynamicLimit {
  getUpgradeModal: (props: RendererProps) => UpgradeModal;
  increasableLimit?: number;
}

export interface UpgradeModalStaticLimit extends BaseLimit, UpgradeModalDynamicLimit {}

export type AnyLimit = ToastErrorStaticLimit | ToastErrorDynamicLimit | UpgradeModalStaticLimit | UpgradeModalDynamicLimit;

export type PlanLimit<Limit> = Partial<Record<PlanType, Limit>>;
