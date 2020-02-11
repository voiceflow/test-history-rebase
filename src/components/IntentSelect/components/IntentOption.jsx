import React from 'react';

import { FlexApart } from '@/components/Flex';
import { defaultLabelRenderer } from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import { PlatformType } from '@/constants';

const PLATFORM_ICONS = {
  [PlatformType.ALEXA]: 'amazon',
  [PlatformType.GOOGLE]: 'google',
};

function IntentOption({ option, searchLabel, getOptionLabel, getOptionValue }) {
  return (
    <FlexApart fullWidth>
      {defaultLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue)}

      {option.builtIn && <SvgIcon icon={PLATFORM_ICONS[option.platform]} color="#BECEDC" />}
    </FlexApart>
  );
}

export default IntentOption;
