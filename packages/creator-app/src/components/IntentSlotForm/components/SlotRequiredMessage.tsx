import React from 'react';

import { styled } from '@/hocs';

export const SlotMessage = styled.span<{ accent?: boolean }>`
  display: inline-block;
  color: ${({ accent }) => (accent ? '#132144' : '#8da2b5')};
  font-weight: normal;
  white-space: nowrap;
`;

const SlotRequiredMessage: React.FC<{ required?: boolean }> = ({ required }) => (
  <SlotMessage accent={required}>{required ? 'is required' : 'is not required'}</SlotMessage>
);

export default SlotRequiredMessage;
