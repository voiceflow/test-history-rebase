import { styled } from '@/hocs/styled';
import { CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME, CANVAS_DRAGGING_CLASSNAME } from '@/pages/Canvas/constants';

import { CANVAS_BUSY_CLASSNAME, CANVAS_INTERACTING_CLASSNAME } from '../constants';

const CanvasContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: clip;
  user-select: none;

  .${CANVAS_INTERACTING_CLASSNAME} & {
    cursor: grab;

    > * > * {
      pointer-events: none;
    }
  }

  .${CANVAS_DRAGGING_CLASSNAME} &:not(.${CANVAS_BUSY_CLASSNAME}) {
    cursor: grabbing;
  }

  .${CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME} & {
    cursor: copy;
  }
`;

export default CanvasContainer;
