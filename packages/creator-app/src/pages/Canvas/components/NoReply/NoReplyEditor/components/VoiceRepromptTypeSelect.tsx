import React from 'react';

import PrefixedSelect, { PrefixedSelectProps } from '@/components/PrefixedSelect';
import { VoicePromptType } from '@/constants';

const REPROMPT_TYPE_LABELS = {
  [VoicePromptType.TEXT]: 'Text-to-Speech',
  [VoicePromptType.AUDIO]: 'Audio or Variable',
};
const REPROMPT_TYPES = [VoicePromptType.TEXT, VoicePromptType.AUDIO];

type VoiceRepromptTypeSelectProps = Omit<PrefixedSelectProps<VoicePromptType, VoicePromptType>, 'options' | 'creatable' | 'onCreate'> & {
  value: VoicePromptType;
  onSelect: (type: VoicePromptType) => void;
};

const VoiceRepromptTypeSelect: React.FC<VoiceRepromptTypeSelectProps> = (props) => (
  <PrefixedSelect prefix="REPLY TYPE" offset={102} options={REPROMPT_TYPES} getOptionLabel={(type) => REPROMPT_TYPE_LABELS[type!]} {...props} />
);

export default VoiceRepromptTypeSelect;
