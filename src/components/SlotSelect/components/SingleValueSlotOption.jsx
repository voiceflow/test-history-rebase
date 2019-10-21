import React from 'react';

import { SingleValueOption } from '@/components/Select';

import BaseSlotOption from './BaseSlotOption';

const SingleValueSlotOption = (props) => (
  <SingleValueOption {...props}>
    <BaseSlotOption data={props.data} />
  </SingleValueOption>
);

export default SingleValueSlotOption;
