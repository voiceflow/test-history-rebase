import { Collapse } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs/styled';

import StepContainer from './StepContainer';
import StepContentContainer from './StepContentContainer';
import StepDropdownHeader from './StepDropdownHeader';

const HeaderSuffixText = styled.span`
  border-radius: 5px;
  border: 1px solid lightgrey;
  padding: 0.25em 10px;
  box-shadow: 0 0 1px 0 #c5d3e0;
  margin-left: 8px;
`;

function StepDropdown({ headerText, headerSuffixText, isOpened, toggle, children }) {
  const hasHeaderSuffixText = headerSuffixText;

  return (
    <StepContainer>
      <StepDropdownHeader onClick={() => toggle()}>
        {headerText}
        {hasHeaderSuffixText && <HeaderSuffixText>{headerSuffixText}</HeaderSuffixText>}
      </StepDropdownHeader>
      <Collapse isOpen={isOpened}>
        <StepContentContainer>{children}</StepContentContainer>
      </Collapse>
    </StepContainer>
  );
}

export default StepDropdown;
