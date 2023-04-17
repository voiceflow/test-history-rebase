import { css, styled } from '@/hocs/styled';

import { HandlePosition } from '../constants';

export interface LineHandleProps {
  edge: 'start' | 'end';
  position: HandlePosition;
}

const LineHandle = styled.div<LineHandleProps>`
  position: absolute;
  z-index: 105;
  pointer-events: all;

  ${({ edge, position }) => {
    const isEnd = edge === 'end';

    switch (position) {
      case HandlePosition.TOP:
        return css`
          top: 0;
          left: 50%;
          cursor: ns-resize;
        `;
      case HandlePosition.TOP_RIGHT:
        return isEnd
          ? css`
              width: 16px;
              height: 50%;
              top: 0;
              right: -8px;
              cursor: nesw-resize;
            `
          : css`
              width: 50%;
              height: 16px;
              top: -8px;
              right: 0;
              cursor: nesw-resize;
            `;
      case HandlePosition.RIGHT:
        return isEnd
          ? css`
              z-index: 106;
              width: 16px;
              height: 25%;
              top: 25%;
              right: -8px;
              cursor: ew-resize;
            `
          : css`
              z-index: 106;
              width: 16px;
              height: 25%;
              bottom: 25%;
              right: -8px;
              cursor: ew-resize;
            `;
      case HandlePosition.BOTTOM_RIGHT:
        return isEnd
          ? css`
              width: 16px;
              height: 50%;
              bottom: 0;
              right: -8px;
              cursor: nwse-resize;
            `
          : css`
              width: 50%;
              height: 16px;
              bottom: -8px;
              right: 0;
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
        return isEnd
          ? css`
              width: 16px;
              height: 50%;
              bottom: 0;
              left: -8px;
              cursor: nesw-resize;
            `
          : css`
              width: 50%;
              height: 16px;
              bottom: -8px;
              left: 0;
              cursor: nesw-resize;
            `;
      case HandlePosition.LEFT:
        return isEnd
          ? css`
              z-index: 106;
              width: 16px;
              height: 25%;
              top: 25%;
              left: -8px;
              cursor: ew-resize;
            `
          : css`
              z-index: 106;
              width: 16px;
              height: 25%;
              bottom: 25%;
              left: -8px;
              cursor: ew-resize;
            `;
      case HandlePosition.TOP_LEFT:
        return isEnd
          ? css`
              width: 16px;
              height: 50%;
              top: 0;
              left: -8px;
              cursor: nwse-resize;
            `
          : css`
              width: 50%;
              height: 16px;
              top: -8px;
              left: 0;
              cursor: nwse-resize;
            `;
      default:
        return null;
    }
  }}
`;

export default LineHandle;
