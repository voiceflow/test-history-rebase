import { FlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const Container = styled(FlexCenter)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 100;
`;

export default Container;
