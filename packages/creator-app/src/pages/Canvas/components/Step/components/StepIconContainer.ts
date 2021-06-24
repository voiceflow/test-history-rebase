import { FlexCenter } from '@voiceflow/ui';

import { styled, units } from '@/hocs';

import { LINE_HEIGHT } from '../constants';

const StepIconContainer = styled(FlexCenter)`
  width: ${units(2)}px;
  height: ${LINE_HEIGHT}px;
  margin-right: ${units(2)}px;
  align-self: start;
`;

export default StepIconContainer;
