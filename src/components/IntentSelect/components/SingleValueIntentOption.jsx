import React from 'react';

import { SingleValueOption } from '@/components/Select';

import BaseIntentOption from './BaseIntentOption';

const SingleValueIntentOption = (props) => (
  <SingleValueOption {...props}>
    <BaseIntentOption data={props.data} />
  </SingleValueOption>
);

export default SingleValueIntentOption;
