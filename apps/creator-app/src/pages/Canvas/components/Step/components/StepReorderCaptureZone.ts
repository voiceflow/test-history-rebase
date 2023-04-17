import { styled } from '@/hocs/styled';
import { NODE_MERGE_TARGET_CLASSNAME } from '@/pages/Canvas/constants';

const StepReorderCaptureZone = styled.div`
  position: absolute;
  left: -16px;
  right: -16px;
  top: -32px;
  bottom: -32px;
  border: 1px solid transparent;
  z-index: 25;
  pointer-events: none;

  .${NODE_MERGE_TARGET_CLASSNAME} & {
    pointer-events: auto;
  }
`;

export default StepReorderCaptureZone;
