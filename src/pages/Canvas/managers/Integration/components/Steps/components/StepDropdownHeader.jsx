import React from 'react';

import { styled } from '@/hocs';

const Container = styled.div`
  padding: 16px 20px;
  font-weight: 500;
  color: grey;
  cursor: pointer;

  :hover {
    color: black;
  }
`;

function StepDropdownHeader({ children, onClick }) {
  return <Container onClick={onClick}>{children}</Container>;
}

export default StepDropdownHeader;
