import React from 'react';

import VariableSelect from '@/componentsV2/VariableSelect';
import { styled } from '@/hocs';

const PrefixedDropdown = styled(VariableSelect)`
  padding-left: 60px;
`;

const PrefixText = styled.span`
  width: 60px;
  position: absolute;
  left: 12px;
  top: 13px;
  font-size: 13px;
`;

const Container = styled.div`
  position: relative;
`;

function PrefixVariableDropdown({ value, onChange, prefix, placeholder }) {
  return (
    <Container>
      <PrefixText>{prefix}</PrefixText>
      <PrefixedDropdown placeholder={placeholder} value={value} onChange={onChange} />
    </Container>
  );
}

export default PrefixVariableDropdown;
