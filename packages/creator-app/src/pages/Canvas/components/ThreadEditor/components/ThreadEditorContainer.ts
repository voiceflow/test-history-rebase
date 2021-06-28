import { CANVAS_INTERACTING_CLASSNAME } from '@/components/Canvas/constants';
import { styled } from '@/hocs';
import { INDICATOR_DIAMETER } from '@/pages/Canvas/components/CommentThread/constants';
import { FadeDownContainer, SlideDown } from '@/styles/animations';

const ThreadEditorContainer = styled.div`
  position: absolute;
  top: -${INDICATOR_DIAMETER / 2}px;
  left: ${INDICATOR_DIAMETER}px;
  width: 323px;
  border-radius: 5px;
  box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
  background: #fff;

  ${SlideDown}

  cursor: initial;

  & > ${FadeDownContainer} {
    & > * {
      padding: 20px 18px;
      border-top: 1px solid #eaeff4;
    }

    & > :first-child {
      border: none;
    }
  }

  .${CANVAS_INTERACTING_CLASSNAME} & {
    pointer-events: none;
  }
`;

export default ThreadEditorContainer;
