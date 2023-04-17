import { BoxFlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import { FadeDown } from '@/styles/animations';

const Container = styled(BoxFlexCenter)`
  flex: 1;
  overflow: hidden;
  overflow: clip;
  margin-right: 18px;

  > * {
    ${FadeDown}
  }
`;

export default Container;
