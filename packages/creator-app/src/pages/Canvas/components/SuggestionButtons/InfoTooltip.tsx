import { Tooltip } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { PlatformContext } from '@/pages/Project/contexts';
import { getPlatformValue } from '@/utils/platform';

const InfoTooltip: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  return (
    <>
      <Tooltip.Title>{getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons')}</Tooltip.Title>

      <Tooltip.Section marginBottomUnits={2}>
        Add {getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'chips' }, 'buttons')} to the end of your messages in
        conversations to allow users to quickly trigger intents.
      </Tooltip.Section>
    </>
  );
};

export default InfoTooltip;
