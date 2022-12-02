import { flexStyles } from '@voiceflow/ui';
import { NavLink, NavLinkProps } from 'react-router-dom';

import { styled, transition } from '@/hocs';

export interface ItemProps extends NavLinkProps {
  nested?: boolean;
}

const Item = styled(NavLink)<ItemProps>`
  ${transition('color')}
  ${flexStyles}

  width: 100%;
  height: ${({ theme }) => theme.components.navSidebar.itemHeight}px;
  font-size: 15px;
  letter-spacing: 0.2px;
  color: #132144;
  padding-left: ${({ nested }) => 32 + (nested ? 20 : 0)}px;
  text-decoration: none;

  &:hover,
  &:active {
    color: rgba(93, 157, 245, 0.8);
    text-decoration: none;
  }

  &.active {
    color: #5d9df5;
    font-weight: 600;
    pointer-events: none;
  }
`;

export default Item;
