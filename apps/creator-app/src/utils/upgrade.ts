import { Utils } from '@voiceflow/common';
import { PlanType } from '@voiceflow/internal';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import type { UpgradePopperData } from '@/components/UpgradePopper';
import type { UpgradeTooltipData } from '@/components/UpgradeTooltip';
import { BOOK_DEMO_LINK, PRICING_LINK } from '@/constants/link.constant';
import * as Feature from '@/ducks/feature/selectors';
import * as Tracking from '@/ducks/tracking';
import * as Workspace from '@/ducks/workspaceV2/selectors/active';
import type { useDispatch } from '@/hooks';
import ModalsManager from '@/ModalsV2/manager';
import { isPlanName } from '@/ModalsV2/modals/Billing/typeguards';
import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';

import { getPlanTypeLabel } from './plans';
import { onOpenInternalURLInANewTabFactory } from './window';

const onOpenPricingPage = onOpenInternalURLInANewTabFactory(PRICING_LINK);
export const onOpenBookDemoPage = onOpenInternalURLInANewTabFactory(BOOK_DEMO_LINK);

// not using modal import here to avoid circular dependency
const onOpenLegacyPaymentModal = () => {
  ModalsManager.open(Utils.id.cuid.slug(), 'LegacyPayment').catch(Utils.functional.noop);
};

const onOpenPaymentModal = (nextPlan: PlanType) => () => {
  ModalsManager.open(Utils.id.cuid.slug(), 'Payment', {
    props: isPlanName(nextPlan) ? { nextPlan } : {},
  }).catch(Utils.functional.noop);
};

export const getLegacyUpgradeModalProps = (
  nextPlan: PlanType,
  upgradePrompt: Tracking.UpgradePrompt
): Pick<UpgradeModal, 'onUpgrade' | 'upgradePrompt' | 'upgradeButtonText'> => {
  return getUpgradeModalProps(nextPlan, upgradePrompt, { isLegacyBilling: true });
};

export const getUpgradeModalProps = (
  nextPlan: PlanType,
  upgradePrompt: Tracking.UpgradePrompt,
  { isLegacyBilling = false }: { isLegacyBilling?: boolean } = {}
): Pick<UpgradeModal, 'onUpgrade' | 'upgradePrompt' | 'upgradeButtonText'> => {
  const state = window.store.getState();
  const teamsPlanSelfServeIsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TEAMS_PLAN_SELF_SERVE);
  const isCheckoutDisabled = Workspace.isCheckoutDisabledSelector(state);

  const teamsIsEnabled = !isLegacyBilling && teamsPlanSelfServeIsEnabled;

  if (!teamsIsEnabled && nextPlan === PlanType.TEAM) {
    return {
      onUpgrade: (dispatch: ReturnType<typeof useDispatch>) => {
        dispatch(Tracking.trackContactSales({ promptType: upgradePrompt }));
        onOpenPricingPage();
      },
      upgradePrompt,
      upgradeButtonText: 'Contact Sales',
    };
  }

  if (nextPlan === PlanType.ENTERPRISE) {
    return {
      onUpgrade: (dispatch: ReturnType<typeof useDispatch>) => {
        dispatch(Tracking.trackContactSales({ promptType: upgradePrompt }));
        onOpenBookDemoPage();
      },
      upgradePrompt,
      upgradeButtonText: 'Contact Sales',
    };
  }

  if (isCheckoutDisabled) {
    return {
      onUpgrade: () => {
        toast.warn('Upgrading is temporarily disabled. Please try again in an hour.');
      },
      upgradePrompt,
      upgradeButtonText: `Upgrade to ${getPlanTypeLabel(nextPlan)}`,
    };
  }

  return {
    onUpgrade: isLegacyBilling ? onOpenLegacyPaymentModal : onOpenPaymentModal(nextPlan),
    upgradePrompt,
    upgradeButtonText: `Upgrade to ${getPlanTypeLabel(nextPlan)}`,
  };
};

export const getUpgradePopperProps = (
  nextPlan: PlanType,
  upgradePrompt: Tracking.UpgradePrompt
): Pick<UpgradePopperData, 'onUpgrade' | 'upgradePrompt' | 'upgradeButtonText'> => getUpgradeModalProps(nextPlan, upgradePrompt);

export const getUpgradeTooltipProps = (
  nextPlan: PlanType,
  upgradePrompt: Tracking.UpgradePrompt
): Pick<UpgradeTooltipData, 'onUpgrade' | 'upgradeButtonText'> => getUpgradeModalProps(nextPlan, upgradePrompt);
