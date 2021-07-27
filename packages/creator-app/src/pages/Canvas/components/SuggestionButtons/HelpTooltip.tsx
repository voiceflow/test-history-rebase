import { PlatformType } from '@voiceflow/internal';
import React from 'react';

import { Section as TooltipSection } from '@/components/Tooltip';
import { PlatformContext } from '@/pages/Skill/contexts';
import { getPlatformValue } from '@/utils/platform';

const HowItWorks: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  return (
    <TooltipSection marginBottomUnits={2}>
      Add {getPlatformValue(platform, { [PlatformType.GOOGLE]: 'chips' }, 'buttons')} to the end of your messages in conversations to allow users to
      quickly trigger intents.
    </TooltipSection>
  );
};

export default HowItWorks;
