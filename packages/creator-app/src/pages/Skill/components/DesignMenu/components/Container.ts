import { css, styled, transition } from '@/hocs';

type ContainerProps = {
  isOpen?: boolean;
  locked?: boolean;
  canvasOnly?: boolean;
};

const Container = styled.aside<ContainerProps>`
  width: ${({ theme }) => theme.components.leftSidebar.width}px;
  padding-right: ${({ theme }) => theme.components.leftSidebar.hiddenWidth}px;

  position: absolute;
  top: 16px;
  bottom: 16px;
  z-index: 10;
  transition: transform 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
  will-change: transform;
  left: ${({ canvasOnly, theme }) => 16 + (canvasOnly ? 0 : theme.components.sidebarIconMenu.width)}px;
  transform: translateX(-${({ theme }) => theme.components.leftSidebar.contentWidth + 18}px);

  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: translateX(0) !important;
    `}

  &:after {
    ${transition('opacity')}

    display: block;
    width: 4px;
    height: 20px;

    position: absolute;
    top: 50%;
    right: 2px;

    border-radius: 3px;
    opacity: 0.5;
    background-image: linear-gradient(to bottom, rgba(110, 132, 154, 0.85), #6e849a);

    content: '';
    pointer-events: none;
  }

  ${({ locked }) =>
    locked &&
    css`
      &:after {
        opacity: 0;
      }
    `}
`;

export default Container;
