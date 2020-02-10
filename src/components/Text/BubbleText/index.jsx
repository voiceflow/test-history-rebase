import React from 'react';

import { styled } from '@/hocs';

const BubbleContainer = styled.span`
  padding: 2px 8px;
  border-radius: 6px;
  background-color: ${({ color }) => color};
  color: white;
  font-weight: 600;
`;

function BubbleText({ color = '#5D9DF5', children }) {
  return <BubbleContainer color={color}>{children}</BubbleContainer>;
}

export default BubbleText;
