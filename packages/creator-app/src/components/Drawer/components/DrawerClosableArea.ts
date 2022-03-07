import { css, styled } from '@/hocs';

import DrawerCloseIcon from './DrawerCloseIcon';

const DrawerClosableArea = styled.div<{ open?: boolean }>`
  width: 20px;
  height: 100%;
  background: transparent;
  position: absolute;
  top: 0;
  left: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 25;

  @keyframes changeBackgroundColorAnimation {
    from {
      background-image: linear-gradient(to bottom, rgba(110, 132, 154, 0.85), #6e849a), linear-gradient(to bottom, white, white);
    }
    to {
      background-image: linear-gradient(to bottom, rgba(61, 130, 226, 0.8), #3d82e2 100%), linear-gradient(to bottom, white, white);
    }
  }

  ${({ open }) =>
    open
      ? css`
          cursor: w-resize;
        `
      : css`
          left: 0px;
          cursor: e-resize;
        `}

  &:hover {
    ${DrawerCloseIcon} {
      background-image: linear-gradient(to bottom, rgba(61, 130, 226, 0.8), #3d82e2 100%), linear-gradient(to bottom, white, white);
      opacity: 1;
      animation-name: changeBackgroundColorAnimation;
      animation-duration: 0.15s;
    }
  }
`;

export default DrawerClosableArea;
