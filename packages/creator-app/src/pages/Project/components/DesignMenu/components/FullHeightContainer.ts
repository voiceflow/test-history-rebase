import { css, styled } from '@/hocs';

interface ContainerProps {
  isOpen?: boolean;
  canvasOnly?: boolean;
}

const Container = styled.aside<ContainerProps>`
  position: absolute;
  top: 16px;
  bottom: 16px;
  z-index: 10;
  width: ${({ theme }) => theme.components.leftSidebar.width}px;
  padding-right: ${({ theme }) => theme.components.leftSidebar.hiddenWidth}px;
  left: ${({ canvasOnly, theme }) => 16 + (canvasOnly ? 0 : theme.components.sidebarIconMenu.width)}px;
  transform: translateX(-${({ theme }) => theme.components.leftSidebar.contentWidth + 18}px);
  transition: transform 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
  will-change: transform;
  pointer-events: none;

  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: translateX(0) !important;
    `}

  &:focus {
    outline: 0;
  }
`;

export default Container;
