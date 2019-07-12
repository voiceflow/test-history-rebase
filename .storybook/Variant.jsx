import React from 'react';
import { FlexCenter } from '@/componentsV2/Flex';
import styled from 'styled-components';

const VariantLabel = styled.div`
  margin: 8px;
  padding: 8px;
  color: #9c9c9c;
  border-bottom: 2px solid #9c9c9c75;
`;

const VariantGroup = styled(FlexCenter)`
  padding: 24px;
  flex-direction: column;
  flex: 1;
  align-self: flex-start;
`;

const VariantContent = styled.div`
  margin: 8px;
`;

function Variant({ label, children }) {
  return (
    <VariantGroup>
      <VariantLabel>{label}</VariantLabel>
      <VariantContent>{children}</VariantContent>
    </VariantGroup>
  );
}

export default Variant;
