import React from 'react';
import styled from 'styled-components';

import SvgIcon from '@/components/SvgIcon';

const Toggle = styled.div`
  display: flex;
  color: #becedc;
  padding: 0 16px;

  &:hover {
    color: #6e849a;
  }
`;

const DropdownIndicator = ({ hasValue, clearValue, selectProps: { onClear, inputValue }, innerProps: { ref } }) => {
  const fullClear = () => {
    onClear();
    clearValue();
  };
  return (
    <Toggle ref={ref} onClick={() => (hasValue ? fullClear() : clearValue())}>
      <SvgIcon icon={onClear && (hasValue || inputValue) ? 'close' : 'caretDown'} size={10} color="currentColor" />
    </Toggle>
  );
};

export default DropdownIndicator;
