import React from 'react';

import { Option } from '@/components/Select';

import BaseSlotOption from './BaseSlotOption';

const SlotOption = (props) => (
  <Option {...props}>
    <BaseSlotOption data={props.data} />
  </Option>
);

export default SlotOption;
