import React from 'react';
import { components } from 'react-select';

const VariableSelectOption = ({ toggleOpen, ...props }) => {
  return (
    <components.Option {...props}>
      <div style={{ display: 'inline-block' }}>{props.data.value}</div>
    </components.Option>
  );
};

export default VariableSelectOption;
