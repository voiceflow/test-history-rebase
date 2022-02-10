import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { Section as TooltipSection, Title } from '@/components/Tooltip';
import { PlatformContext } from '@/pages/Project/contexts';
import { getPlatformValue } from '@/utils/platform';

const InfoTooltip: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  return (
    <>
      <Title>{getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons')}</Title>

      <TooltipSection marginBottomUnits={2}>
        Add {getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'chips' }, 'buttons')} to the end of your messages in
        conversations to allow users to quickly trigger intents.
      </TooltipSection>
    </>
  );
};

export default InfoTooltip;
