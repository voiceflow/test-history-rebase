import React from 'react';

import { Section as TooltipSection, Title } from '@/components/Tooltip';
import { PlatformType } from '@/constants';
import { PlatformContext } from '@/pages/Skill/contexts';
import { getPlatformValue } from '@/utils/platform';

const InfoTooltip: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  return (
    <>
      <Title>{getPlatformValue(platform, { [PlatformType.GOOGLE]: 'Chips' }, 'Buttons')}</Title>

      <TooltipSection marginBottomUnits={2}>
        Add {getPlatformValue(platform, { [PlatformType.GOOGLE]: 'chips' }, 'buttons')} to the end of your messages in conversations to allow users to
        quickly trigger intents.
      </TooltipSection>
    </>
  );
};

export default InfoTooltip;
