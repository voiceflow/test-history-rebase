import React from 'react';
import { components } from 'react-select';

import BaseOption from './BaseOption';

const Option = ({ children, ...props }) => (
  <components.Option {...props}>
    <BaseOption label={props.data.label}>{children}</BaseOption>
  </components.Option>
);

export default Option;
