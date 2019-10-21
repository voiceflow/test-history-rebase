import Overlay from '@/components/Overlay';
import { css, styled } from '@/hocs';

import StepContainer from './StepCard';

const StepOverlay = styled(Overlay)`
  border-radius: 0;

  ${({ isDragging }) =>
    !isDragging &&
    css`
      ${StepContainer}:focus &,
      ${StepContainer}:focus-within & {
        border-left: 2px solid #0f7ec0;
      }
    `}
`;

export default StepOverlay;
