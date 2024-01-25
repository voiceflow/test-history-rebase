import { Utils } from '@voiceflow/common';
import { PlanType } from '@voiceflow/internal';

import type { UpgradePopperData } from '@/components/UpgradePopper';
import type { UpgradeTooltipData } from '@/components/UpgradeTooltip';
import { BOOK_DEMO_LINK, PLAN_INFO_LINK } from '@/constants/links';
import * as Tracking from '@/ducks/tracking';
import type { useDispatch } from '@/hooks';
import ModalsManager from '@/ModalsV2/manager';
import type { UpgradeModal } from '@/ModalsV2/modals/Upgrade';

import { getPlanTypeLabel } from './plans';
import { onOpenInternalURLInANewTabFactory } from './window';

export const onOpenPricingPage = onOpenInternalURLInANewTabFactory(PLAN_INFO_LINK);
export const onOpenBookDemoPage = onOpenInternalURLInANewTabFactory(BOOK_DEMO_LINK);

// not using modal import here to avoid circular dependency
export const onOpenPaymentModal = () => ModalsManager.open(Utils.id.cuid.slug(), 'Payment').catch(Utils.functional.noop);

export const getUpgradeModalProps = (
  nextPlan: PlanType,
  upgradePrompt: Tracking.UpgradePrompt
): Pick<UpgradeModal, 'onUpgrade' | 'upgradePrompt' | 'upgradeButtonText'> => {
  if (nextPlan === PlanType.TEAM) {
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

  return {
    onUpgrade: onOpenPaymentModal,
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
