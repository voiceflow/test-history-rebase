import React from 'react';
import { NavLinkProps } from 'react-router-dom';
import styled from 'styled-components';

import { PopperNavItem } from '@/components/Popper';

const PopperNavContainer = styled.div`
  a {
    border-top: solid 1px transparent;
    border-bottom: solid 1px transparent;
    border-left: 3px solid transparent;
  }

  .active {
    background-color: #eef4f6;
    border-top: solid 1px #dfe3ed;
    border-bottom: solid 1px #dfe3ed;
    border-left: 3px solid #5d9df5;
  }

  :hover {
    background-color: #eef4f6;
  }
`;

const ExportNavItem: React.FC<NavLinkProps> = ({ ...props }) => (
  <PopperNavContainer>
    <PopperNavItem {...props} />
  </PopperNavContainer>
);

export default ExportNavItem;
