import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexApart, getNestedMenuFormattedLabel, GetOptionLabel, GetOptionValue, Icon, SvgIcon } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { isCustomizableBuiltInIntent } from '@/utils/intent';
import { createPlatformSelector } from '@/utils/platform';

const getPlatformIcon = createPlatformSelector<Icon>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'amazon',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'google',
  },
  'inFlow'
);

interface IntentOptionProps {
  option: Realtime.Intent;
  searchLabel?: string | null;
  getOptionLabel: GetOptionLabel<string>;
  getOptionValue: GetOptionValue<Realtime.Intent, string>;
}

const IntentOption: React.FC<IntentOptionProps> = ({ option, searchLabel, getOptionLabel, getOptionValue }) => (
  <FlexApart fullWidth>
    <span>{getNestedMenuFormattedLabel(getOptionLabel(getOptionValue(option)), searchLabel)}</span>

    {isCustomizableBuiltInIntent(option) && <SvgIcon icon={getPlatformIcon(option.platform)} color="#BECEDC" />}
  </FlexApart>
);

export default IntentOption;
