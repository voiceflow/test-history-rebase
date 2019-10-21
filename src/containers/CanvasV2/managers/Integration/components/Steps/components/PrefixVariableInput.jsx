import React from 'react';

import VariableInput from '@/components/VariableInput';
import { styled } from '@/hocs';

const PrefixedInput = styled(VariableInput)`
  padding-left: 71px;
`;

const PrefixText = styled.span`
  position: absolute;
  left: 16px;
  top: 13px;
  font-size: 13px;
  color: #62778c;
  z-index: 1;
  font-weight: 600;
`;

const Container = styled.div`
  position: relative;
`;

function PrefixVariableInput({ value, onChange, prefix, placeholder }) {
  return (
    <Container>
      <PrefixText>{prefix}</PrefixText>
      <PrefixedInput placeholder={placeholder} value={value} onChange={onChange} />
    </Container>
  );
}

export default PrefixVariableInput;
