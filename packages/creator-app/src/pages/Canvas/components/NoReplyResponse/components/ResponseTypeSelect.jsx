import React from 'react';

import PrefixedSelect from '@/components/PrefixedSelect';
import { RepromptType } from '@/constants';

const REPROMPT_TYPE_LABELS = {
  [RepromptType.TEXT]: 'Text-to-Speech',
  [RepromptType.AUDIO]: 'Audio or Variable',
};
const REPROMPT_TYPES = [RepromptType.TEXT, RepromptType.AUDIO];

const ResponseTypeSelect = ({ value, ...props }) => (
  <PrefixedSelect
    prefix="REPLY TYPE"
    offset={102}
    value={value}
    options={REPROMPT_TYPES}
    getOptionLabel={(type) => REPROMPT_TYPE_LABELS[type]}
    {...props}
  />
);

export default ResponseTypeSelect;
