import React from 'react';

import { styled } from '@/hocs/styled';

const Container = styled.span`
  background-color: rgba(168, 200, 252, 0.85);
`;

export default function FakeSelection({ children }) {
  return <Container>{children}</Container>;
}
