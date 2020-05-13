import { css, styled } from '@/hocs';
import BlockContainer from '@/pages/Canvas/components/Block/components/BlockContainer';
import DraggingNode from '@/pages/Canvas/components/DraggingNode';
import { MERGE_ACTIVE_NODE_CLASSNAME } from '@/pages/Canvas/constants';

export type NodeContainerProps = {
  isActive: boolean;
};

const NodeContainer = styled(DraggingNode)<NodeContainerProps>`
  box-sizing: content-box;

  ${({ isActive }) =>
    isActive &&
    css`
      z-index: 10;
    `}

  &:focus {
    outline: 0;
  }

  &:focus,
  &:focus-within {
    z-index: 20;
  }

  &.${MERGE_ACTIVE_NODE_CLASSNAME} {
    z-index: 10;
  }

  ${BlockContainer} {
    position: absolute;
    transform: translateX(-50%);
  }
`;

export default NodeContainer;
