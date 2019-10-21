import React from 'react';
import { components } from 'react-select';

import BaseOption from './BaseOption';

const SingleValueOption = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <BaseOption label={props.data.label}>{children}</BaseOption>
  </components.SingleValue>
);

export default SingleValueOption;
