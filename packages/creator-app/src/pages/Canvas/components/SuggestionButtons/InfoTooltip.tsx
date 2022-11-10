import * as Platform from '@voiceflow/platform-config';
import { Tooltip } from '@voiceflow/ui';
import React from 'react';

import { PlatformContext } from '@/pages/Project/contexts';
import { getPlatformValue } from '@/utils/platform';

const InfoTooltip: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  return (
    <>
      <Tooltip.Title>{getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons')}</Tooltip.Title>

      <Tooltip.Section marginBottomUnits={2}>
        Add {getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'chips' }, 'buttons')} to the end of your messages in
        conversations to allow users to quickly trigger intents.
      </Tooltip.Section>
    </>
  );
};

export default InfoTooltip;
