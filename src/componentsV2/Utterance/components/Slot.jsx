import React from 'react';

import { VariableStyle } from '@/components/VariableTag';
import { styled } from '@/hocs';

const Text = styled.span`
  > span {
    ${VariableStyle}
    display: inline;
    border: none;
    padding-top: 0px;
    margin-bottom: -1px;
    background-color: ${({ color }) => color};
    color: #fff;
  }
`;

// eslint-disable-next-line react/display-name
export default React.forwardRef(({ children, mention }, ref) => (
  <Text ref={ref} color={mention.color}>
    {children}
  </Text>
));
