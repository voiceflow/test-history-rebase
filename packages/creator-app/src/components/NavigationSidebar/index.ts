import { SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

import Item from './components/Item';
import NavItem from './components/NavItem';

export const Container = styled.div<{ isMainMenu?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ theme }) => theme.components.navSidebar.width}px;
  min-width: ${({ theme }) => theme.components.navSidebar.width}px;
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.colors.borders};
  margin-left: ${({ theme, isMainMenu }) => (isMainMenu ? 0 : theme.components.sidebarIconMenu.width)}px;
  background: #fbfbfb;
`;

export const ItemsContainer = styled.div`
  display: flex;
  padding: 16px;
  flex: 1;
  flex-direction: column;
  position: relative;
`;

export const Footer = styled.div<{ isMainMenu?: boolean; isOpen?: boolean }>`
  ${transition('background')}
  border-top: 1px solid ${({ theme }) => theme.colors.borders};
  padding: ${({ isMainMenu }) => (isMainMenu ? '20px 24px' : '20px 32px')};
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 15px;
  cursor: pointer;
  background: ${({ isMainMenu }) => (isMainMenu ? 'RGB(253, 253, 253)' : 'rgba(238, 244, 246, 0.85)')};

  &:hover,
  &:active {
    background: rgba(238, 244, 246, 1);
  }

  ${({ isOpen }) =>
    isOpen &&
    css`
      background: rgba(238, 244, 246, 1);
    `}

  ${SvgIcon.Container} {
    opacity: 0.85;
    transform: rotate(90deg);
  }

  &:hover,
  &:active {
    ${SvgIcon.Container} {
      opacity: 1;
      transform: translateX(-4px) rotate(90deg);
    }
  }
`;

export default Object.assign(Container, { Item, NavItem, Footer, ItemsContainer });
