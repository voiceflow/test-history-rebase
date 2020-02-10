import React from 'react';

import { slotStyles, variableStyle } from '@/components/VariableTag';
import { styled } from '@/hocs';

const Text = styled.span`
  > span {
    ${({ isVariable }) => (isVariable ? variableStyle : slotStyles)}

    word-break: normal;
    border: none;
    line-height: 18px;
    box-shadow: ${({ isVariable }) => (isVariable ? 'inset 0 0 0 1px #dfe5ea' : 'none')};

    &:before,
    &:after {
      content: '';
      display: none;
    }
  }
`;

// eslint-disable-next-line react/display-name
export default React.forwardRef(({ children, mention }, ref) => (
  <Text ref={ref} color={mention.color} isVariable={mention.isVariable}>
    {children}
  </Text>
));
