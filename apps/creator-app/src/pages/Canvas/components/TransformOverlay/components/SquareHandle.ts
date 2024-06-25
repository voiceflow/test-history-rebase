import { css, styled } from '@/hocs/styled';

import { HandlePosition } from '../constants';

export interface SquareHandleProps {
  position: HandlePosition;
}

const SquareHandle = styled.div<SquareHandleProps>`
  position: absolute;
  width: 16px;
  height: 16px;
  z-index: 110;
  pointer-events: all;

  &:before {
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    background: #fff;
    border-radius: 1px;
    box-shadow:
      0 1px 3px 0 rgba(17, 49, 96, 0.08),
      0 0 1px 1px rgba(17, 49, 96, 0.16);

    content: '';
  }

  ${({ position }) => {
    switch (position) {
      case HandlePosition.TOP:
        return css`
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          cursor: ns-resize;
        `;
      case HandlePosition.TOP_RIGHT:
        return css`
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
          cursor: nesw-resize;
        `;
      case HandlePosition.RIGHT:
        return css`
          right: 0;
          top: 50%;
          transform: translate(50%, -50%);
          cursor: ew-resize;
        `;
      case HandlePosition.BOTTOM_RIGHT:
        return css`
          bottom: 0;
          right: 0;
          transform: translate(50%, 50%);
          cursor: nwse-resize;
        `;
      case HandlePosition.BOTTOM:
        return css`
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          cursor: ns-resize;
        `;
      case HandlePosition.BOTTOM_LEFT:
        return css`
          bottom: 0;
          left: 0;
          transform: translate(-50%, 50%);
          cursor: nesw-resize;
        `;
      case HandlePosition.LEFT:
        return css`
          left: 0;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: ew-resize;
        `;
      case HandlePosition.TOP_LEFT:
        return css`
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          cursor: nwse-resize;
        `;
      default:
        return null;
    }
  }}
`;

export default SquareHandle;
