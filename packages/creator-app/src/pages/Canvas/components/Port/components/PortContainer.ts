import { styled } from '@/hocs/styled';
import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_MERGING_CLASSNAME,
  CANVAS_SELECTING_GROUP_CLASSNAME,
  CANVAS_THREAD_OPEN_CLASSNAME,
  NODE_DISABLED_CLASSNAME,
} from '@/pages/Canvas/constants';

const PortContainer = styled.div<{ isConnectedToActions?: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  align-self: center;
  align-items: center;
  justify-content: center;
  cursor: ${({ isConnectedToActions }) => (isConnectedToActions ? 'inherit' : 'copy')};

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
