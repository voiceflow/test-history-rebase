import { styled } from '@/hocs';
import { CANVAS_MARKUP_CREATING } from '@/pages/Canvas/constants';

const ChildContainer = styled.div`
  position: relative;

  .${CANVAS_MARKUP_CREATING} & {
    pointer-events: none;
  }
`;

export default ChildContainer;
