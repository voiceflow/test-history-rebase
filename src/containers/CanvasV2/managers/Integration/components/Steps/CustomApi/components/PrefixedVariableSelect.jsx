import React from 'react';

import VariableSelect from '@/componentsV2/VariableSelect';
import { styled } from '@/hocs';

const PrefixedContainer = styled(VariableSelect)`
  .variable-box__control {
    padding-left: 79px !important;
    background: #fff !important;
  }
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

function PrefixedVariableSelect({ value, onChange }) {
  return (
    <Container>
      <PrefixText>APPLY TO</PrefixText>
      <PrefixedContainer plain value={value} onChange={onChange} />
    </Container>
  );
}

export default PrefixedVariableSelect;
