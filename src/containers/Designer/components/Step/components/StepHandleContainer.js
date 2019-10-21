import { styled, transition, units } from '@/hocs';

import StepContainer from './StepCard';

const StepHandleContainer = styled.div`
  ${transition('width', 'margin-right')}

  width: 0;
  margin: 0;
  overflow: hidden;

  &:hover {
    cursor: grab;
  }

  ${StepContainer}:active &:hover {
    cursor: grabbing;
  }

  ${StepContainer}:hover & {
    /* FIXME: using a 3x3 grid icon instead of a 2x3 */
    width: 12px;
    margin-right: ${units()}px;
  }
`;

export default StepHandleContainer;
