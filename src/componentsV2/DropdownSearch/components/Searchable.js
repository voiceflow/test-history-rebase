import React, { useState } from 'react';
import ReactSelect from 'react-select';
import styled from 'styled-components';

import { selectDropdown } from '../styles';
import { DropdownIndicator, NestedMenu } from './components';

const Select = styled(ReactSelect)`
  ${selectDropdown}
`;

const RawSearchDropdown = (props) => {
  const { value, className, isExpandable, variant, actionClick, actionText, options, onClear, onSelect, placeholder, disabled } = props;
  const [active, setOpen] = useState(false);
  const message = 'No results found';

  return (
    <Select
      classNamePrefix="select"
      noOptionsMessage={() => message}
      className={className}
      onClear={onClear}
      options={options}
      value={value}
      actionClick={actionClick}
      actionText={actionText}
      variant={variant}
      onChange={onSelect}
      placeholder={placeholder}
      isDisabled={disabled}
      isExpandable={isExpandable}
      components={{ DropdownIndicator, Menu: NestedMenu }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      active={active}
      menuIsOpen={true}
      blurInputOnSelect={true}
    />
  );
};

const SearchDropdown = styled(React.memo(RawSearchDropdown))`
  ${selectDropdown}
  font-size: 15px;
  height: 42px;
  color: #8da2b5;
  flex: 1;
`;

export default SearchDropdown;
