import { styled, units } from '@/hocs';
import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_MERGING_CLASSNAME,
  CANVAS_SELECTING_GROUP_CLASSNAME,
  CANVAS_THREAD_OPEN_CLASSNAME,
  NODE_DISABLED_CLASSNAME,
} from '@/pages/Canvas/constants';

import { PORT_SIZE } from '../constants';

const PORT_LEFT_PADDING = 12;

const PortContainer = styled.div`
  position: relative;
  height: ${({ theme }) => theme.components.blockStep.minHeight}px;
  width: ${({ theme }) => PORT_LEFT_PADDING + PORT_SIZE + theme.unit * 2}px;
  margin: -${units(2)}px -${units(2)}px -${units(2)}px 0;
  padding-left: ${PORT_LEFT_PADDING}px;
  align-self: center;
  cursor: copy;

  .${CANVAS_COMMENTING_ENABLED_CLASSNAME} & {
    cursor: crosshair;
  }

  .${CANVAS_COMMENTING_ENABLED_CLASSNAME}.${CANVAS_THREAD_OPEN_CLASSNAME} & {
    cursor: default;
  }

  .${CANVAS_MERGING_CLASSNAME} &,
  .${CANVAS_SELECTING_GROUP_CLASSNAME} &,
  .${NODE_DISABLED_CLASSNAME} & {
    cursor: inherit;
  }
`;

export default PortContainer;
