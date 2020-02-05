import styled, { css } from 'styled-components';

import { flexStyles } from '@/componentsV2/Flex';

export const itemStyles = css`
  ${flexStyles}

  height: ${({ theme, divider }) => (!divider ? `${theme.components.menuItem.height}px` : 0)};
  padding: 0 24px;
  background: #fff;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
  margin: ${({ divider }) => (divider ? '4px 0' : 'none')};
  border-bottom: ${({ divider }) => (divider ? '1px solid #EAEFF4' : 'none')};

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
      color: #8da2b5;
      background: #fff;
    `}
  
  ${({ capitalize }) =>
    capitalize &&
    css`
      text-transform: capitalize;
    `}
    
  &:hover {
   ${({ disabled }) =>
     !disabled &&
     css`
       background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
     `}
   
  }
  
   ${({ active }) =>
     active &&
     css`
       background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
     `}

  &:active {
   ${({ disabled }) =>
     !disabled &&
     css`
       background: linear-gradient(180deg, rgba(230, 238, 241, 0.85) 0%, #eaf0f2 100%), #ffffff;
     `}
  }
`;

const MenuItem = styled.li`
  ${itemStyles}
`;

export default MenuItem;
