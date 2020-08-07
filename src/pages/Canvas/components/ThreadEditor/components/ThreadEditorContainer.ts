import { styled } from '@/hocs';
import { INDICATOR_DIAMETER } from '@/pages/Canvas/components/CommentThread/constants';

const ThreadEditorContainer = styled.div`
  position: absolute;
  top: -${INDICATOR_DIAMETER / 2}px;
  left: ${INDICATOR_DIAMETER}px;
  width: 323px;
  border-radius: 5px;
  box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
  background: #fff;

  animation: fadein 0.15s ease, movein 0.15s ease, scaleY 0.1s ease;
  transform-origin: top;

  cursor: initial;

  & > * {
    padding: 20px 18px;
    border-top: 1px solid #eaeff4;
  }

  & > :first-child {
    border: none;
  }
`;

export default ThreadEditorContainer;
