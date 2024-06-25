import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { TippyTooltipProps } from '@voiceflow/ui';
import { Box, stopPropagation, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { BOOK_DEMO_LINK, REQUEST_MORE_TOKENS_LINK } from '@/constants/link.constant';
import { Permission } from '@/constants/permissions';
import * as Workspace from '@/ducks/workspaceV2';
import { useDispatch, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { useFeature } from '@/hooks/feature.hook';
import { usePaymentModal } from '@/hooks/modal.hook';
import { isStarterPlan } from '@/utils/plans';
import { openURLInANewTab } from '@/utils/window';

import { useGPTQuotas, useWorkspaceAIAssist } from './feature';

export const useAIUsage = () => {
  const gptQuota = useGPTQuotas();
  const workspaceAIAssistEnabled = useWorkspaceAIAssist();

  const isOn = workspaceAIAssistEnabled;
  const usage = gptQuota.consumed / gptQuota.quota;

  return {
    isOn,
    usage,
  };
};

export const useAIUsageTooltip = ({ onOpenModal }: { onOpenModal: VoidFunction }): TippyTooltipProps => {
  const chargebeeTokens = useFeature(Realtime.FeatureFlag.CHARGEBEE_TOKENS);
  const [canConfigureWorkspaceBilling] = usePermission(Permission.WORKSPACE_BILLING_MANAGE);
  const plan = useSelector(Workspace.active.planSelector);
  const isOnProTrial = useSelector(Workspace.active.isOnProTrialSelector);
  const isProWorkspace = useSelector(Workspace.active.isProSelector);
  const paymentModal = usePaymentModal();
  const refreshWorkspaceQuotaDetails = useDispatch(Workspace.refreshWorkspaceQuotaDetails);
  const gptQuota = useGPTQuotas();
  const aiUsage = useAIUsage();
  const [trackingEvents] = useTrackingEvents();
  const hasChargebeeTokensActive = chargebeeTokens;

  // Conditionally show buttons. There is no collision between them and only one button is shown at a time.
  const showOldButton = !hasChargebeeTokensActive;
  const showUgradeButton = hasChargebeeTokensActive && (isOnProTrial || isStarterPlan(plan));
  const showPurchaseButton =
    hasChargebeeTokensActive && isProWorkspace && canConfigureWorkspaceBilling && !showUgradeButton;
  const showDisabledButton =
    hasChargebeeTokensActive && isProWorkspace && !canConfigureWorkspaceBilling && !showUgradeButton;

  React.useEffect(() => {
    let timer: number | null = null;
    const fetchNextQuota = async () => {
      timer = window.setTimeout(async () => {
        await refreshWorkspaceQuotaDetails(Realtime.QuotaNames.TOKENS);
        fetchNextQuota();
      }, 60000);
    };

    fetchNextQuota();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return {
    style: { display: 'block' },
    width: 232,
    interactive: true,
    onShow: () => {
      refreshWorkspaceQuotaDetails(Realtime.QuotaNames.TOKENS);
      trackingEvents.trackAIQuotaCheck({ quota: gptQuota.quota, consume: gptQuota.consumed });
    },
    content: aiUsage.isOn ? (
      <Box width="100%">
        <TippyTooltip.Title>Token Usage</TippyTooltip.Title>

        <Box>
          {gptQuota.consumed.toLocaleString()}{' '}
          <Text color="#A2A7A8">/ {gptQuota.quota.toLocaleString()} tokens used.</Text>
        </Box>

        {showOldButton && (
          <TippyTooltip.FooterButton
            buttonText="Request more tokens"
            onClick={() => openURLInANewTab(REQUEST_MORE_TOKENS_LINK)}
          />
        )}

        {showUgradeButton && (
          <TippyTooltip.FooterButton
            buttonText="Upgrade to Pro"
            onClick={stopPropagation(Utils.functional.chain(TippyTooltip.closeAll, () => paymentModal.openVoid({})))}
          />
        )}

        {showDisabledButton && (
          <TippyTooltip content="Only Workspace Admins can add more tokens. Ask your Admin to purchase a top-up.">
            <TippyTooltip.FooterButton buttonText="Purchase Tokens" disabled onClick={stopPropagation()} />
          </TippyTooltip>
        )}

        {showPurchaseButton && <TippyTooltip.FooterButton buttonText="Purchase Tokens" onClick={onOpenModal} />}
      </Box>
    ) : (
      <TippyTooltip.FooterButton buttonText="Contact Sales" onClick={() => openURLInANewTab(BOOK_DEMO_LINK)}>
        This workspace doesn’t have access to this agent type. To enable access, contact a workspace owner or admin.
      </TippyTooltip.FooterButton>
    ),
  };
};
