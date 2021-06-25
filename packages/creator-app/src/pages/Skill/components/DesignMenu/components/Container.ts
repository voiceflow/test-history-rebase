import { css, styled, transition } from '@/hocs';

type ContainerProps = {
  isOpen?: boolean;
  locked?: boolean;
  canvasOnly?: boolean;
  navigationRedesign?: boolean;
};

const Container = styled.aside<ContainerProps>`
  width: ${({ theme }) => theme.components.leftSidebar.width}px;
  padding-right: ${({ theme }) => theme.components.leftSidebar.hiddenWidth}px;

  position: absolute;
  z-index: 10;
  transition: transform 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
  will-change: transform;

  ${({ theme, canvasOnly, navigationRedesign }) =>
    navigationRedesign
      ? css`
          top: 16px;
          left: ${16 + (canvasOnly ? 0 : theme.components.sidebarIconMenu.width)}px;
          bottom: 16px;
          transform: translateX(-${({ theme }) => theme.components.leftSidebar.contentWidth + 18}px);
        `
      : css`
          top: 50px;
          left: 0;
          bottom: ${canvasOnly ? 50 : 90}px;
          transform: translateX(-${({ theme }) => theme.components.leftSidebar.contentWidth}px);
        `}

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
    right: ${({ navigationRedesign }) => (navigationRedesign ? 2 : 6)}px;

    border-radius: 3px;
    opacity: 0.5;
    background-image: linear-gradient(to bottom, rgba(110, 132, 154, 0.85), #6e849a);

    content: '';
    pointer-events: none;
  }

  ${({ locked, navigationRedesign }) =>
    locked &&
    navigationRedesign &&
    css`
      &:after {
        opacity: 0;
      }
    `}
`;

export default Container;
