import { styled, units } from '@/hocs/styled';

import StepItemContainer from './StepItemContainer';

export const NoMatchNoReplyContainer = styled.div`
  width: 100%;

  ${StepItemContainer}::before {
    position: absolute;
    top: -1px;
    height: 1px;
    left: ${units(3)}px;
    right: 0;
    content: '';
    border-top: 1px solid #eaeff4;
  }
`;
