import React from 'react';

import { Option } from '@/components/Select';

import BaseIntentOption from './BaseIntentOption';

const IntentOption = (props) => (
  <Option {...props}>
    <BaseIntentOption data={props.data} />
  </Option>
);

export default IntentOption;
