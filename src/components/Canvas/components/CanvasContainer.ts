import { styled } from '@/hocs';

import { CANVAS_BUSY_CLASSNAME } from '../constants';

const CanvasContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  user-select: none;

  &:active:not(.${CANVAS_BUSY_CLASSNAME}) {
    cursor: grabbing;
  }
`;

export default CanvasContainer;
