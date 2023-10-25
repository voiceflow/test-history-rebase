import * as Platform from '@voiceflow/platform-config';
import { Intent } from '@voiceflow/sdk-logux-designer';
import { FlexApart, getNestedMenuFormattedLabel, GetOptionLabel, GetOptionValue, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { isCustomizableBuiltInIntent } from '@/utils/intent';

import BuiltInIntentIcon from './BuiltInIntentIcon';

interface IntentOptionProps {
  option: Platform.Base.Models.Intent.Model | Intent;
  isFocused?: boolean;
  searchLabel?: string | null;
  getOptionLabel: GetOptionLabel<string>;
  getOptionValue: GetOptionValue<Platform.Base.Models.Intent.Model | Intent, string>;
}

const IntentOption: React.FC<IntentOptionProps> = ({ option, isFocused, searchLabel, getOptionLabel, getOptionValue }) => (
  <FlexApart fullWidth>
    <span>{getNestedMenuFormattedLabel(getOptionLabel(getOptionValue(option)), searchLabel)}</span>

    {isCustomizableBuiltInIntent(option) && (
      <TippyTooltip placement="top" content="Built-in intent">
        <BuiltInIntentIcon isItemFocused={isFocused} />
      </TippyTooltip>
    )}
  </FlexApart>
);

export default IntentOption;
