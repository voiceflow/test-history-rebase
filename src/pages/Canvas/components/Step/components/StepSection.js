import Flex from '@/components/Flex';
import { styled, units } from '@/hocs';

import StepItemContainer from './StepItemContainer';

const StepSection = styled(Flex)`
  flex-direction: column;
  width: 100%;

  ${StepItemContainer}:not(:first-of-type)::before {
    position: absolute;
    top: -1px;
    height: 1px;
    left: ${units(6.5)}px;
    right: 0;
    content: '';
    border-top: 1px solid #eaeff4;
  }
`;

export default StepSection;
