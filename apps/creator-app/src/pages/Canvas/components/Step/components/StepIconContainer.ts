import { FlexCenter, transition } from '@voiceflow/ui';

import { styled, units } from '@/hocs/styled';
import { NODE_ACTIVE_CLASSNAME } from '@/pages/Canvas/constants';

import { LINE_HEIGHT } from '../constants';

const StepIconContainer = styled(FlexCenter)<{ color?: string }>`
  ${transition('opacity')}
  width: ${units(2)}px;
  height: ${LINE_HEIGHT}px;
  margin-right: ${units(2)}px;
  align-self: start;
  color: ${({ color }) => color};
  opacity: 85%;

  .${NODE_ACTIVE_CLASSNAME} & {
    opacity: 100%;
  }
`;

export default StepIconContainer;
