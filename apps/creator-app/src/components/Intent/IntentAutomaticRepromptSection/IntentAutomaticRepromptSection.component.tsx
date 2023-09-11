import { Box, Text, Toggle } from '@voiceflow/ui-next';
import React from 'react';

import { label } from './IntentAutomaticRepromptSection.css';
import type { IIntentAutomaticRepromptSection } from './IntentAutomaticRepromptSection.interface';

export const IntentAutomaticRepromptSection: React.FC<IIntentAutomaticRepromptSection> = ({ value, onValueChange }) => (
  <Box py={11} px={24} height="58px" align="center" justify="space-between">
    <Text className={label({ active: value })}>Automatically reprompt</Text>

    <Toggle value={value} onValueChange={onValueChange} />
  </Box>
);
