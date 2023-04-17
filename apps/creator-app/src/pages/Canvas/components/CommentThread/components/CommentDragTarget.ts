import { CANVAS_ANIMATING_CLASSNAME } from '@/components/Canvas/constants';
import { styled } from '@/hocs/styled';
import DragTarget from '@/pages/Canvas/components/DragTarget';
import { ANIMATION_SPEED } from '@/styles/theme';

const CommentDragTarget = styled(DragTarget)`
  left: 0;
  top: 0;

  .${CANVAS_ANIMATING_CLASSNAME} & {
    transition: transform ease-in-out ${ANIMATION_SPEED}s;
  }
`;

export default CommentDragTarget;
