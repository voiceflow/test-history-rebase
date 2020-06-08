import { css, styled } from '@/hocs';

import { HandlePosition } from '../constants';

export type SquareHandleProps = {
  position: HandlePosition;
};

const SquareHandle = styled.div<SquareHandleProps>`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  z-index: 110;
  pointer-events: all;
  border-radius: 1px;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.16);

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
