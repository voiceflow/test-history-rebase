import React from 'react';

import PrefixedSelect from '@/components/PrefixedSelect';
import { RepromptType } from '@/constants';

const AnyPrefixedSelect = PrefixedSelect as any;

const REPROMPT_TYPE_LABELS = {
  [RepromptType.TEXT]: 'Text-to-Speech',
  [RepromptType.AUDIO]: 'Audio or Variable',
};
const REPROMPT_TYPES = [RepromptType.TEXT, RepromptType.AUDIO];

interface ResponseTypeSelectProps {
  value: RepromptType;
  onSelect: (type: RepromptType) => void;
}

const ResponseTypeSelect: React.FC<ResponseTypeSelectProps> = ({ value, ...props }) => (
  <AnyPrefixedSelect
    prefix="REPLY TYPE"
    offset={102}
    value={value}
    options={REPROMPT_TYPES}
    getOptionLabel={(type: RepromptType) => REPROMPT_TYPE_LABELS[type]}
    {...props}
  />
);

export default ResponseTypeSelect;
