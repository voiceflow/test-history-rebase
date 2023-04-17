import React from 'react';

import { styled } from '@/hocs/styled';

const Container = styled.div`
  padding: 16px 20px;
  font-weight: 500;
  color: grey;
  cursor: pointer;

  :hover {
    color: black;
  }
`;

const StepDropdownHeader = ({ children, onClick }) => <Container onClick={onClick}>{children}</Container>;

export default StepDropdownHeader;
