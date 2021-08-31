import React from 'react';

import PrefixedSelect, { PrefixedSelectProps } from '@/components/PrefixedSelect';
import { RepromptType } from '@/constants';

const REPROMPT_TYPE_LABELS = {
  [RepromptType.TEXT]: 'Text-to-Speech',
  [RepromptType.AUDIO]: 'Audio or Variable',
};
const REPROMPT_TYPES = [RepromptType.TEXT, RepromptType.AUDIO];

type VoiceRepromptTypeSelectProps = Omit<PrefixedSelectProps<RepromptType, RepromptType>, 'options' | 'creatable' | 'onCreate'> & {
  value: RepromptType;
  onSelect: (type: RepromptType) => void;
};

const VoiceRepromptTypeSelect: React.FC<VoiceRepromptTypeSelectProps> = (props) => (
  <PrefixedSelect prefix="REPLY TYPE" offset={102} options={REPROMPT_TYPES} getOptionLabel={(type) => REPROMPT_TYPE_LABELS[type!]} {...props} />
);

export default VoiceRepromptTypeSelect;
