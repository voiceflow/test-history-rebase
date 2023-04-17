import { Box, OverflowText, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { SMS_DOCUMENTATION } from '@/constants/platforms';
import { styled } from '@/hocs/styled';
import WarningIcon from '@/pages/NLUManager/pages/IntentTable/components/WarningIcon';
import type { MessagingServiceType } from '@/platforms/sms/types';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

const OptionTooltip = styled(TippyTooltip)`
  width: 100%;
  height: 100%;
  cursor: no-drop;
  align-items: center;
  justify-content: space-between;
`;

export const serviceOptionRenderer = (service: MessagingServiceType & { disabled?: boolean }) => {
  if (!service.disabled) return <>{service.name}</>;

  return (
    <OptionTooltip
      display="flex"
      interactive
      content={
        <TippyTooltip.FooterButton buttonText="More" onClick={onOpenInternalURLInANewTabFactory(SMS_DOCUMENTATION)}>
          <Box width={200}>
            <Box mb="8px">This messaging service has no numbers associated with it.</Box>
            From the Twilio console, add at least 1 number to this service to make it selectable in Voiceflow.
          </Box>
        </TippyTooltip.FooterButton>
      }
      position="right"
    >
      <OverflowText mr={4}>{service.name}</OverflowText>
      <WarningIcon />
    </OptionTooltip>
  );
};
