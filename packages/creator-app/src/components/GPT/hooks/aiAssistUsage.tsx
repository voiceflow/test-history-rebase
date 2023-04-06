import { Box, Text, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import { BOOK_DEMO_LINK, REQUEST_MORE_TOKENS } from '@/constants';
import { useTrackingEvents } from '@/hooks';
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

export const useAIUsageTooltip = (): TippyTooltipProps => {
  const gptQuota = useGPTQuotas();
  const aiUsage = useAIUsage();
  const [trackingEvents] = useTrackingEvents();

  return {
    style: { display: 'block' },
    interactive: true,
    width: 232,
    onShow: () => {
      trackingEvents.trackAIQuotaCheck({ quota: gptQuota.quota, consume: gptQuota.consumed });
    },
    content: aiUsage.isOn ? (
      <TippyTooltip.FooterButton buttonText="Request more tokens" onClick={() => openURLInANewTab(REQUEST_MORE_TOKENS)}>
        <TippyTooltip.Title>Token Usage</TippyTooltip.Title>

        <Box>
          {gptQuota.consumed.toLocaleString()} <Text color="#A2A7A8">/ {gptQuota.quota.toLocaleString()} tokens used.</Text>
        </Box>
      </TippyTooltip.FooterButton>
    ) : (
      <TippyTooltip.FooterButton buttonText="Contact Sales" onClick={() => openURLInANewTab(BOOK_DEMO_LINK)}>
        This workspace doesn’t have access to this assistant type. To enable access, contact a workspace owner or admin.
      </TippyTooltip.FooterButton>
    ),
  };
};
