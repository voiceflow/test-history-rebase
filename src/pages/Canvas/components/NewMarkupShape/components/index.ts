import { styled } from '@/hocs';
import DraggingNode, { DraggingNodeProps } from '@/pages/Canvas/components/DraggingNode';

export { default as NewRectangle } from './NewRectangle';

// eslint-disable-next-line import/prefer-default-export
export const Container = styled(DraggingNode as React.FC<DraggingNodeProps & React.ComponentProps<'div'>>)`
  rect {
    border: 1px solid transparent;
  }
`;
