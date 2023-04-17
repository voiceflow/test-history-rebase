import { flexCenterStyles } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import { FadeDownContainer } from '@/styles/animations';

const TrainContainer = styled(FadeDownContainer)`
  ${flexCenterStyles}
  flex: 1;
`;

export default TrainContainer;
