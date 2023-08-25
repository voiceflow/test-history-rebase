import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Text, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import { BOOK_DEMO_LINK, REQUEST_MORE_TOKENS } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { useDispatch, useTrackingEvents } from '@/hooks';
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
  const refreshWorkspaceQuotaDetails = useDispatch(Workspace.refreshWorkspaceQuotaDetails);
  const gptQuota = useGPTQuotas();
  const aiUsage = useAIUsage();
  const [trackingEvents] = useTrackingEvents();

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
      trackingEvents.trackAIQuotaCheck({ quota: gptQuota.quota, consume: gptQuota.consumed });
    },
    content: aiUsage.isOn ? (
      <Box width="100%">
        <TippyTooltip.FooterButton buttonText="Request more tokens" onClick={() => openURLInANewTab(REQUEST_MORE_TOKENS)}>
          <TippyTooltip.Title>Token Usage</TippyTooltip.Title>

          <Box>
            {gptQuota.consumed.toLocaleString()} <Text color="#A2A7A8">/ {gptQuota.quota.toLocaleString()} tokens used.</Text>
          </Box>
        </TippyTooltip.FooterButton>
      </Box>
    ) : (
      <TippyTooltip.FooterButton buttonText="Contact Sales" onClick={() => openURLInANewTab(BOOK_DEMO_LINK)}>
        This workspace doesn’t have access to this assistant type. To enable access, contact a workspace owner or admin.
      </TippyTooltip.FooterButton>
    ),
  };
};
