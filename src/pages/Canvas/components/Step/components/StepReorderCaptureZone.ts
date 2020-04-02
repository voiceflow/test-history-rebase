import { styled } from '@/hocs';
import { MERGE_ACTIVE_NODE_CLASSNAME } from '@/pages/Canvas/constants';

const StepReorderCaptureZone = styled.div`
  position: absolute;
  left: -16px;
  right: -16px;
  top: -32px;
  bottom: -32px;
  border: 1px solid transparent;
  z-index: 25;
  pointer-events: none;

  .${MERGE_ACTIVE_NODE_CLASSNAME} & {
    pointer-events: auto;
  }
`;

export default StepReorderCaptureZone;
