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

const DropdownIndicator = (props) => {
  const {
    hasValue,
    clearValue,
    selectProps: { onClear, inputValue },
    innerProps: { ref },
  } = props;

  return (
    <Toggle ref={ref} onClick={() => (hasValue ? onClear() : clearValue())}>
      <SvgIcon icon={(hasValue && onClear) || inputValue ? 'close' : 'caretDown'} size={10} color="currentColor" />
    </Toggle>
  );
};

export default DropdownIndicator;
