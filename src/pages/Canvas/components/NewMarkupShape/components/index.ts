import { styled } from '@/hocs';
import { DragTargetProps } from '@/pages/Canvas/components/DragTarget';
import NodeDragTarget from '@/pages/Canvas/components/Node/components/NodeDragTarget';

export { default as NewRectangle } from './NewRectangle';

// eslint-disable-next-line import/prefer-default-export
export const Container = styled(NodeDragTarget as React.FC<DragTargetProps & React.ComponentProps<'div'>>)`
  rect {
    border: 1px solid transparent;
  }
`;
