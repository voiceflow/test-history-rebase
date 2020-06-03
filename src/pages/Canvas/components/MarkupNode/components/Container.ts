import { styled } from '@/hocs';
import DraggingNode, { DraggingNodeProps } from '@/pages/Canvas/components/DraggingNode';

import ChildContainer from './ChildContainer';

export type NodeContainerProps = DraggingNodeProps & {
  position: [number, number];
};

const NodeContainer = styled(DraggingNode)<NodeContainerProps>`
  ${ChildContainer} {
    position: absolute;
  }
`;

export default NodeContainer;
