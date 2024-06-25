import { Popper } from '@voiceflow/ui';
import React from 'react';
import type { NavLinkProps } from 'react-router-dom';

import { styled } from '@/hocs/styled';

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

const ShareNavItem: React.FC<NavLinkProps> = ({ ...props }) => (
  <PopperNavContainer>
    <Popper.NavItem {...props} />
  </PopperNavContainer>
);

export default ShareNavItem;
