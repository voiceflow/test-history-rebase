import React from 'react';
import ReactSelect from 'react-select';
import styled from 'styled-components';

import { selectDropdown } from '../styles';
import { DropdownIndicator, NestedMenu, Option } from './components';

const Select = styled(ReactSelect)`
  ${selectDropdown}
`;

const RawSearchDropdown = (props) => {
  const { value, className, variant, actionClick, actionText, options, onClear, onSelect, placeholder, disabled } = props;

  return (
    <Select
      classNamePrefix="select"
      className={className}
      onClear={onClear}
      options={options}
      value={value}
      actionClick={actionClick}
      actionText={actionText}
      variant={variant}
      onChange={onSelect}
      placeholder={placeholder}
      disabled={disabled}
      components={{ DropdownIndicator, Option, Menu: NestedMenu }}
    />
  );
};

const SearchDropdown = styled(React.memo(RawSearchDropdown))`
  ${selectDropdown}
  font-size: 15px;
  line-height: 18px;
  color: #8da2b5;
  flex: 1;
`;

export default SearchDropdown;
