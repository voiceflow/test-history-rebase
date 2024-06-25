import { styled } from '@/hocs/styled';
import BlockContainer from '@/pages/Canvas/components/Block/components/BlockContainer';
import * as ChipStyles from '@/pages/Canvas/components/Chip/styles';
import type { DragTargetProps } from '@/pages/Canvas/components/DragTarget';
import { NODE_ACTIVE_CLASSNAME, NODE_MERGE_TARGET_CLASSNAME } from '@/pages/Canvas/constants';

import NodeDragTarget from './NodeDragTarget';

const NodeContainer = styled(NodeDragTarget)<DragTargetProps>`
  box-sizing: content-box;

  &:focus {
    outline: 0;
  }

  &:focus,
  &:focus-within {
    z-index: 20;
  }

  &.${NODE_MERGE_TARGET_CLASSNAME}, &.${NODE_ACTIVE_CLASSNAME} {
    z-index: 10;
  }

  ${BlockContainer} {
    position: absolute;
    transform: translateX(-50%);
  }

  ${ChipStyles.Container} {
    position: absolute;
    transform: translateX(-50%);
  }
`;

export default NodeContainer;
