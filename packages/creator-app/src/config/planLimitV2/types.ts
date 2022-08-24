import type { PlanType } from '@voiceflow/internal';
import React from 'react';

import type { useDispatch } from '@/hooks';

export interface UpgradeModal {
  title: React.ReactNode;
  header: React.ReactNode;
  onUpgrade: (dispatch: ReturnType<typeof useDispatch>) => void;
  description: React.ReactNode;
  cancelButtonText?: string;
  upgradeButtonText: string;
}

export interface BaseLimit {
  value: number;
}

export interface ToastErrorLimit extends BaseLimit {
  error: React.ReactNode;
}

export interface UpgradeModalLimit extends BaseLimit {
  upgradeModal: UpgradeModal;
}

export type PlanLimit<T extends BaseLimit> = Partial<Record<PlanType, T>>;
