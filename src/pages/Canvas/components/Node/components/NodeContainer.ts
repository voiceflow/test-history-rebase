import { styled } from '@/hocs';
import BlockContainer from '@/pages/Canvas/components/Block/components/BlockContainer';
import DraggingNode, { DraggingNodeProps } from '@/pages/Canvas/components/DraggingNode';
import { NODE_ACTIVE_CLASSNAME, NODE_MERGE_TARGET_CLASSNAME } from '@/pages/Canvas/constants';

export type NodeContainerProps = DraggingNodeProps & {
  position: [number, number];
};

const NodeContainer = styled(DraggingNode)<NodeContainerProps>`
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
`;

export default NodeContainer;
