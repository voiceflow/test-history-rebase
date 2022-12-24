import { css, styled } from '@/hocs/styled';

interface ContainerProps {
  isOpen?: boolean;
  canvasOnly?: boolean;
  menuWidth: number;
}

export const FullHeightContainer = styled.aside<ContainerProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;

  left: ${({ canvasOnly, theme }) => (canvasOnly ? 0 : theme.components.sidebarIconMenu.width)}px;
  transform: translateX(-${({ menuWidth }) => menuWidth}px);
  transition: transform 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
  will-change: transform;

  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: translateX(0) !important;
    `}

  &:focus {
    outline: 0;
  }
`;

export const Content = styled.div`
  display: flex;
  height: 100%;
  background-color: #fdfdfd;
  width: 100%;
`;
