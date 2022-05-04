import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexApart, getNestedMenuFormattedLabel, GetOptionLabel, GetOptionValue, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { isCustomizableBuiltInIntent } from '@/utils/intent';

import BuiltInIntentIcon from './BuiltInIntentIcon';

interface IntentOptionProps {
  option: Realtime.Intent;
  isFocused?: boolean;
  searchLabel?: string | null;
  getOptionLabel: GetOptionLabel<string>;
  getOptionValue: GetOptionValue<Realtime.Intent, string>;
}

const IntentOption: React.FC<IntentOptionProps> = ({ option, isFocused, searchLabel, getOptionLabel, getOptionValue }) => (
  <FlexApart fullWidth>
    <span>{getNestedMenuFormattedLabel(getOptionLabel(getOptionValue(option)), searchLabel)}</span>

    {isCustomizableBuiltInIntent(option) && (
      <TippyTooltip position="top" title="Built-in intent" bodyOverflow>
        <BuiltInIntentIcon isItemFocused={isFocused} />
      </TippyTooltip>
    )}
  </FlexApart>
);

export default IntentOption;
