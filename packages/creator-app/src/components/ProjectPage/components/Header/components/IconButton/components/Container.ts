import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs';
import { ClassName } from '@/styles/constants';

const Container = styled(Box.Flex)`
  position: relative;
  height: 100%;

  .${ClassName.TOOLTIP} {
    height: 100%;
  }
`;

export default Container;
