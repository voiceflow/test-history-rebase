import React from 'react';

import SvgIcon, { SvgIconContainer } from '@/components/SvgIcon';
import VariableInput from '@/components/VariableInput';
import Flex from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const Container = styled(Flex)`
  border-bottom: 1px solid #eaeff4;
  padding-top: 15px;
  padding-bottom: 15px;

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
  width: calc(100% - 60px);
`;

const RightSection = styled.div`
  padding-left: 8px;
  align-self: baseline;
  padding-top: 12px;
`;

const HeaderKeyContainer = styled.div`
  position: relative;
  margin-bottom: 6px;
`;

const ButtonContainer = styled.div`
  border-radius: 50%;
  width: 17px;
  height: 17px;
  margin: 0 4px;
  padding: 3px;
  display: inline-block;
  cursor: pointer;
  transition: all 0.1s linear;
  opacity: 0.85;
  background-color: ${(props) => (props.disabled ? '#D4D9E6' : '#6E849A')};

  ${SvgIconContainer} {
    color: white;
  }
  :hover {
    opacity: 1;
  }
`;

function MetaDataLineItem({ value, keyPlaceholder, onUpdate, onRemove, onAdd, children, onlyItem, firstItem }) {
  return (
    <Container>
      <LeftSection>
        <HeaderKeyContainer>
          <VariableInput placeholder={keyPlaceholder} value={value} onChange={onUpdate} />
        </HeaderKeyContainer>
        {children}
      </LeftSection>
      <RightSection>
        <ButtonContainer
          disabled={onlyItem}
          onClick={() => {
            if (onlyItem) return;
            onRemove();
          }}
        >
          <SvgIcon icon="zoomOut" height={11} width={11} />
        </ButtonContainer>
        {firstItem && (
          <ButtonContainer onClick={onAdd} style={{ marginRight: 0 }}>
            <SvgIcon icon="zoomIn" height={11} width={11} />
          </ButtonContainer>
        )}
      </RightSection>
    </Container>
  );
}

export default MetaDataLineItem;
