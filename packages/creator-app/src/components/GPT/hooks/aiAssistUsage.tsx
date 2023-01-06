import { Box, Text, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import { REQUEST_MORE_TOKENS } from '@/constants';
import { useTrackingEvents } from '@/hooks';
import { openURLInANewTab } from '@/utils/window';

import { useGPTQuotas, useGPTSettingsToggles } from './feature';

export const useAIUsage = () => {
  const gptQuota = useGPTQuotas();
  const gptSettings = useGPTSettingsToggles();

  const someAIFeaturesEnabled = React.useMemo(
    () => Object.keys(gptSettings.project).some((featureKey) => gptSettings.project[featureKey]),
    [gptSettings.project]
  );

  const isOn = someAIFeaturesEnabled && gptSettings.workspace;
  const usage = gptQuota.consumed / gptQuota.quota;

  return {
    isOn,
    usage,
  };
};

export const useAIUsageTooltip = (): TippyTooltipProps => {
  const gptQuota = useGPTQuotas();
  const [trackingEvents] = useTrackingEvents();

  return {
    style: { display: 'block' },
    interactive: true,
    width: 232,
    onShow: () => {
      trackingEvents.trackAIQuotaCheck({ quota: gptQuota.quota, consume: gptQuota.consumed });
    },
    content: (
      <TippyTooltip.FooterButton buttonText="Request more tokens" onClick={() => openURLInANewTab(REQUEST_MORE_TOKENS)}>
        <TippyTooltip.Title>AI Assist Usage</TippyTooltip.Title>

        <Box>
          {gptQuota.consumed.toLocaleString()} <Text color="#A2A7A8">/ {gptQuota.quota.toLocaleString()} tokens used.</Text>
        </Box>
      </TippyTooltip.FooterButton>
    ),
  };
};
