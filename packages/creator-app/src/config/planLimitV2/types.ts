import type { PlanType } from '@voiceflow/internal';
import React from 'react';

import type { UpgradePrompt } from '@/ducks/tracking';
import type { useDispatch } from '@/hooks';

interface RendererProps {
  limit: number;
  plan: PlanType;
}

export interface UpgradeModal {
  title: React.ReactNode;
  header: React.ReactNode;
  maxWidth?: number;
  onUpgrade: (dispatch: ReturnType<typeof useDispatch>) => void;
  description: React.ReactNode;
  upgradePrompt?: UpgradePrompt;
  cancelButtonText?: string;
  upgradeButtonText: string;
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
