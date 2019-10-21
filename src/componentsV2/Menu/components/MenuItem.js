import styled, { css } from 'styled-components';

import { flexStyles } from '@/componentsV2/Flex';

const MenuItem = styled.li`
  ${flexStyles}

  height: ${({ theme }) => theme.components.menuItem.height}px;
  padding: 0 24px;
  background: #fff;
  overflow: hidden;
  user-select: none;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
      color: #8da2b5;
      background: #fff;
    `}
    
  &:hover {
   ${({ disabled }) =>
     !disabled &&
     css`
       background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
     `}
   
  }

  &:active {
   ${({ disabled }) =>
     !disabled &&
     css`
       background: linear-gradient(180deg, rgba(230, 238, 241, 0.85) 0%, #eaf0f2 100%), #ffffff;
     `}
  }

`;

export default MenuItem;
