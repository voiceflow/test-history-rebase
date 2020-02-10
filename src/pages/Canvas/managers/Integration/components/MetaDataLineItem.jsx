import React from 'react';

import AddMinusButton from '@/componentsV2/AddMinusButton';
import Flex from '@/componentsV2/Flex';
import VariablesInput from '@/componentsV2/VariablesInput';
import { styled } from '@/hocs';

const Container = styled(Flex)`
  position: relative;
  margin-right: -32px;
  padding: 15px 32px 15px 0;
  border-bottom: 1px solid #eaeff4;

  &:last-child {
    padding-top: 15px;
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  &:first-child {
    padding-top: 0px;
  }
`;

const LeftSection = styled.div`
  width: calc(100% - 38px);
`;

const RightSection = styled.div`
  padding-left: 8px;
  align-self: baseline;
  padding-top: 14px;
  position: absolute;
  right: 32px;
`;

const HeaderKeyContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

function MetaDataLineItem({ value, keyPlaceholder, onUpdate, onRemove, children, onlyItem }) {
  return (
    <Container>
      <LeftSection>
        <HeaderKeyContainer>
          <VariablesInput space={false} placeholder={keyPlaceholder} value={value} onBlur={({ text }) => onUpdate(text)} />
        </HeaderKeyContainer>

        {children}
      </LeftSection>

      <RightSection>
        <AddMinusButton type="minus" disabled={onlyItem} onClick={() => !onlyItem && onRemove()} />
      </RightSection>
    </Container>
  );
}

export default MetaDataLineItem;
