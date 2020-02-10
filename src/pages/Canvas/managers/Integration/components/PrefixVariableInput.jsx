import React from 'react';

import Flex, { FlexCenter } from '@/components/Flex';
import VariablesInput from '@/components/VariablesInput';
import { Container as VariablesContainer } from '@/components/VariablesInput/components';
import { styled } from '@/hocs';

const PrefixedInput = styled(VariablesInput)`
  padding-left: 71px;
`;

const PrefixText = styled(FlexCenter)`
  position: absolute;
  left: 16px;
  font-size: 13px;
  color: #62778c;
  z-index: 1;
  font-weight: 600;
  pointer-events: none;
`;

const Container = styled(Flex)`
  position: relative;
  flex: 1;
  overflow: hidden;

  ${VariablesContainer} {
    flex: 1;
    max-width: 100%;
  }
`;

function PrefixVariableInput({ value, onChange, prefix, placeholder }) {
  return (
    <Container>
      <PrefixText>{prefix}</PrefixText>
      <PrefixedInput space={false} placeholder={placeholder} value={value} onBlur={({ text }) => onChange(text)} />
    </Container>
  );
}

export default PrefixVariableInput;
