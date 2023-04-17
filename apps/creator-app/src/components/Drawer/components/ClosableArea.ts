import { css, styled, transition } from '@/hocs/styled';
import { SlideOutDirection } from '@/styles/transitions';

import CloseIcon from './CloseIcon';

interface ClosableAreaProps {
  open?: boolean;
  zIndex?: number;
  direction?: SlideOutDirection;
  drawerWidth: number;
  disableAnimation?: boolean;
}

const ClosableArea = styled.div<ClosableAreaProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ zIndex = 25 }) => zIndex};

  ${({ disableAnimation }) =>
    !disableAnimation &&
    css`
      ${transition('transform')}
    `}

  ${({ open, direction, drawerWidth }) =>
    direction === SlideOutDirection.LEFT
      ? css`
          right: 0;
          cursor: ${open ? 'e-resize' : 'w-resize'};
          transform: translateX(${open ? -drawerWidth : 0}px);
        `
      : css`
          left: 0;
          cursor: ${open ? 'w-resize' : 'e-resize'};
          transform: translateX(${open ? drawerWidth : 0}px);
        `}

  &:hover {
    ${CloseIcon}:after {
      opacity: 1;
    }
  }
`;

export default ClosableArea;
