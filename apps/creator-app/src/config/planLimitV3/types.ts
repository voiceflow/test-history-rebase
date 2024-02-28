import { Subscription } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import React from 'react';

import { LimitType } from '@/constants/limits';
import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';

interface RendererProps {
  limit: number;
}

export interface BaseStaticLimit {
  limit: number;
}
export type ErrorRenderer = (props: RendererProps) => React.ReactNode;

export interface ToastErrorEntitlementLimit {
  toastError: ErrorRenderer;
}

export interface UpgradeModalEntitlementLimit {
  upgradeModal: (props: RendererProps) => UpgradeModal;
}

export interface ToastErrorStaticLimit extends BaseStaticLimit, ToastErrorEntitlementLimit {}

export interface UpgradeModalStaticLimit extends BaseStaticLimit, UpgradeModalEntitlementLimit {}

export type EntitlementType = keyof Subscription['entitlements'];

export type EntitlemenLimit = ToastErrorEntitlementLimit | UpgradeModalEntitlementLimit;

export type StaticLimit = ToastErrorStaticLimit | UpgradeModalStaticLimit;

export type AnyLimit = EntitlemenLimit | StaticLimit;

export interface EntitlementLimitDef {
  limit: LimitType;
  entitlement: EntitlementType;
  limits: Partial<Record<PlanType, EntitlemenLimit>>;
}

export interface StaticLimitDef {
  limit: LimitType;
  limits: Partial<Record<PlanType, StaticLimit>>;
}

export type LimitV3 = EntitlementLimitDef | StaticLimitDef;
